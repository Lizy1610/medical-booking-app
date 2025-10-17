import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const JWT_SECRET = Buffer.from(process.env.JWT_SECRET_BASE64, "base64").toString("utf-8");

/**
 * Middleware para proteger rutas con JWT.
 */
export function requireAuth(req, res, next) {
  try {

    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Encabezado de autorización inválido" });
    }


    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }


    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"], 
      maxAge: "1h", 
    });

   
    req.user = payload;

    next();
  } catch (err) {
    console.error("❌ Error en autenticación:", err.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
