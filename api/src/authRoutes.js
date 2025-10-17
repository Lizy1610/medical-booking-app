import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import { sendOTP, verifyOTP, verifyOTPWithoutMarking } from "./otpService.js";

const router = Router();

// Ruta para solicitar OTP (solo para registro)
router.post(
  "/request-otp",
  body("email").isEmail().normalizeEmail(),
  body("purpose").isIn(["login", "register", "password_reset"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, purpose } = req.body;

    try {
      console.log(`📧 Solicitud OTP recibida: email="${email}", purpose="${purpose}"`);
      
      const emailSent = await sendOTP(email, purpose);
      if (emailSent) {
        res.json({ message: "Código enviado al correo electrónico" });
      } else {
        res.status(500).json({ message: "Error enviando el código" });
      }
    } catch (error) {
      console.error("Error en request-otp:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

// Ruta para verificar OTP
router.post(
  "/verify-otp",
  body("email").isEmail().normalizeEmail(),
  body("code").isLength({ min: 6, max: 6 }).isNumeric(),
  body("purpose").isIn(["login", "register", "password_reset"]),
  async (req, res) => {
    console.log("🔐 Verificación OTP recibida:", req.body);
    console.log("🌐 IP del cliente:", req.ip);
    console.log("📱 User-Agent:", req.get('User-Agent'));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, code, purpose } = req.body;

    try {
      console.log("🔍 Verificando OTP para:", { email, code, purpose });
      const result = await verifyOTP(email, code, purpose);
      console.log("✅ Resultado verificación:", result);
      
      if (result.valid) {
        res.json({ message: result.message, verified: true });
      } else {
        res.json({ message: result.message, verified: false });
      }
    } catch (error) {
      console.error("❌ Error en verify-otp:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

// Ruta de registro con OTP
router.post(
  "/register",
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("username").trim().isLength({ min: 2, max: 60 }).withMessage("Username debe tener entre 2 y 60 caracteres").matches(/^[a-zA-Z0-9._-]+$/).withMessage("Username solo puede contener letras, números, puntos, guiones y guiones bajos"),
  body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 3, max: 72 }).withMessage("Password debe tener entre 3 y 72 caracteres"),
  body("dateOfBirth").optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }),
  body("gender").optional({ nullable: true }).isIn(["Hombre", "Mujer", "Prefiero no decirlo", "Otro"]),
  // body("otpCode").isLength({ min: 6, max: 6 }).isNumeric().withMessage("Código OTP debe ser de 6 dígitos"),
  async (req, res) => {
    console.log("📝 Registro recibido:", req.body);
    console.log("🌐 IP del cliente:", req.ip);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, email, password, dateOfBirth, gender } = req.body;

    console.log("📝 Intentando registrar usuario:", { name, username, email });

    // Verificar que el email fue verificado con OTP (sin requerir el código nuevamente)
    console.log("🔍 Verificando que el email fue verificado con OTP...");
    const [verifiedOTP] = await pool.query(
      'SELECT id FROM otp_codes WHERE email = ? AND purpose = ? AND used = TRUE ORDER BY created_at DESC LIMIT 1',
      [email, "register"]
    );
    
    if (!verifiedOTP.length) {
      console.log("❌ Email no verificado con OTP:", email);
      return res.status(400).json({ message: "Debes verificar tu email con OTP antes de registrarte" });
    }
    
    console.log("✅ Email verificado con OTP:", email);

    console.log("🔍 Verificando si usuario ya existe...");
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    
    if (exists.length) {
      console.log("❌ Usuario ya existe:", exists[0]);
      return res.status(409).json({ message: "Correo o usuario ya registrado" });
    }

    console.log("🔐 Generando hash de contraseña...");
    const hash = await bcrypt.hash(password, 12);

    console.log("💾 Insertando usuario en la base de datos...");
    await pool.query(
      "INSERT INTO users (name, username, email, password_hash, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?)",
      [name, username, email, hash, dateOfBirth ?? null, gender ?? null]
    );

    // El OTP ya fue marcado como usado durante la verificación, no necesitamos hacerlo aquí

    console.log("✅ Usuario registrado exitosamente con OTP:", email);
    return res.status(201).json({ message: "Usuario creado exitosamente" });
  }
);

// Ruta de login simplificada (sin OTP por ahora)
router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 3, max: 72 }).withMessage("Password debe tener entre 3 y 72 caracteres"),
  body("otpCode").isLength({ min: 6, max: 6 }).isNumeric().withMessage("Código OTP debe ser de 6 dígitos"),
  async (req, res) => {
    console.log("🔐 Login recibido:", req.body);
    console.log("🌐 IP del cliente:", req.ip);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Errores de validación en login:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, otpCode } = req.body;

    console.log("🔐 Intentando login con OTP para:", email);

    // Verificar OTP primero
    console.log("🔍 Verificando OTP para login:", { email, otpCode, purpose: "login" });
    const otpResult = await verifyOTP(email, otpCode, "login");
    console.log("✅ Resultado verificación OTP para login:", otpResult);
    
    if (!otpResult.valid) {
      console.log("❌ OTP inválido para login:", email);
      return res.status(400).json({ message: "Código OTP inválido o expirado" });
    }

    const [rows] = await pool.query(
      "SELECT id, name, username, email, date_of_birth, gender, password_hash FROM users WHERE email = ?",
      [email]
    );
    
    console.log(`📊 Usuarios encontrados: ${rows.length}`);
    if (!rows.length) {
      console.log("❌ Usuario no encontrado:", email);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];
    console.log("👤 Usuario encontrado:", { id: user.id, email: user.email, name: user.name });
    
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log("❌ Contraseña incorrecta para:", email);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // El OTP ya fue marcado como usado por verifyOTP

    const token = jwt.sign(
      { sub: String(user.id), email: user.email, name: user.name, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login exitoso con OTP para:", email);
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