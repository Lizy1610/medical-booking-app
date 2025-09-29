import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "fs";
import https from "https";
import http from "http";
import authRoutes from "./authRoutes.js";
import { requireAuth } from "./authMiddleware.js";
import { pool } from "./db.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 });
app.use(limiter);

app.get("/health", async (_req, res) => {
  try {
    const [r] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: r[0].ok === 1 });
  } catch {
    res.status(500).json({ status: "db_error" });
  }
});

app.use("/api/auth", authRoutes);

app.get("/api/me", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const [rows] = await pool.query(
    "SELECT id, name, username, email, date_of_birth, gender, created_at FROM users WHERE id = ?",
    [userId]
  );
  if (!rows.length) return res.status(404).json({ message: "No encontrado" });
  res.json({ user: rows[0] });
});

const port = Number(process.env.PORT || 4000);

const keyPath = process.env.HTTPS_KEY;
const certPath = process.env.HTTPS_CERT;
const hasTLS = keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath);

if (hasTLS) {
  const server = https.createServer(
    { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
    app
  );
  server.listen(port, () => console.log(`HTTPS en https://localhost:${port}`));
} else {
  const server = http.createServer(app);
  server.listen(port, () => console.log(`HTTP en http://localhost:${port}`));
}
