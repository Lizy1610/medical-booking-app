import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const router = Router();

router.post(
  "/register",
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("username").trim().isLength({ min: 3, max: 60 }).matches(/^[a-zA-Z0-9._-]+$/),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8, max: 72 }),
  body("dateOfBirth").optional().isISO8601(),
  body("gender").optional().isIn(["Hombre", "Mujer", "Prefiero no decirlo", "Otro"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, username, email, password, dateOfBirth, gender } = req.body;

    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (exists.length) return res.status(409).json({ message: "Correo o usuario ya registrado" });

    const hash = await bcrypt.hash(password, 12);

    await pool.query(
      "INSERT INTO users (name, username, email, password_hash, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?)",
      [name, username, email, hash, dateOfBirth ?? null, gender ?? null]
    );

    return res.status(201).json({ message: "Usuario creado" });
  }
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8, max: 72 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT id, name, username, email, date_of_birth, gender, password_hash FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: "Credenciales inválidas" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { sub: String(user.id), email: user.email, name: user.name, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        dateOfBirth: user.date_of_birth,
        gender: user.gender
      }
    });
  }
);

export default router;
