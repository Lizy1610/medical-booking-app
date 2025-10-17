import { pool } from './db.js';
import { sendOTPEmail } from './emailService.js';

// Generar código OTP aleatorio
export const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

// Guardar código OTP en la base de datos
export const saveOTP = async (email, code, purpose) => {
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Marcar códigos anteriores como usados
    await pool.query(
        'UPDATE otp_codes SET used = TRUE WHERE email = ? AND purpose = ?',
        [email, purpose]
    );

    // Insertar nuevo código
    await pool.query(
        'INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (?, ?, ?, ?)',
        [email, code, purpose, expiresAt]
    );
};

// Enviar código OTP por correo
export const sendOTP = async (email, purpose) => {
    const code = generateOTP();
    await saveOTP(email, code, purpose);
    
    const emailSent = await sendOTPEmail(email, code, purpose);
    return emailSent;
};

// Verificar código OTP (marca como usado)
export const verifyOTP = async (email, code, purpose) => {
    console.log(`🔍 Verificando OTP: email=${email}, code=${code}, purpose=${purpose}`);
    
    const [rows] = await pool.query(
        'SELECT * FROM otp_codes WHERE email = ? AND code = ? AND purpose = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
        [email, code, purpose]
    );

    console.log(`📊 Códigos OTP encontrados: ${rows.length}`);
    if (rows.length > 0) {
        console.log(`📋 Código OTP encontrado:`, {
            id: rows[0].id,
            email: rows[0].email,
            code: rows[0].code,
            purpose: rows[0].purpose,
            created_at: rows[0].created_at,
            expires_at: rows[0].expires_at,
            used: rows[0].used
        });
    }

    if (rows.length === 0) {
        // Verificar si hay códigos expirados o usados
        const [allCodes] = await pool.query(
            'SELECT * FROM otp_codes WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 5',
            [email, purpose]
        );
        console.log(`📋 Todos los códigos para ${email} (${purpose}):`, allCodes);
        
        return { valid: false, message: 'Código inválido o expirado' };
    }

    // Marcar código como usado
    await pool.query(
        'UPDATE otp_codes SET used = TRUE WHERE id = ?',
        [rows[0].id]
    );

    console.log(`✅ OTP verificado exitosamente para ${email}`);
    return { valid: true, message: 'Código verificado correctamente' };
};

// Verificar código OTP sin marcarlo como usado (para registro)
export const verifyOTPWithoutMarking = async (email, code, purpose) => {
    console.log(`🔍 Verificando OTP sin marcar: email=${email}, code=${code}, purpose=${purpose}`);
    
    const [rows] = await pool.query(
        'SELECT * FROM otp_codes WHERE email = ? AND code = ? AND purpose = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
        [email, code, purpose]
    );

    console.log(`📊 Códigos OTP encontrados (sin marcar): ${rows.length}`);
    if (rows.length > 0) {
        console.log(`📋 Código OTP encontrado (sin marcar):`, {
            id: rows[0].id,
            email: rows[0].email,
            code: rows[0].code,
            purpose: rows[0].purpose,
            created_at: rows[0].created_at,
            expires_at: rows[0].expires_at,
            used: rows[0].used
        });
    }

    if (rows.length === 0) {
        // Verificar si hay códigos expirados o usados
        const [allCodes] = await pool.query(
            'SELECT * FROM otp_codes WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 5',
            [email, purpose]
        );
        console.log(`📋 Todos los códigos para ${email} (${purpose}) sin marcar:`, allCodes);
        
        return { valid: false, message: 'Código inválido o expirado' };
    }

    console.log(`✅ OTP verificado exitosamente para ${email} (sin marcar como usado)`);
    return { valid: true, message: 'Código verificado correctamente' };
};

// Limpiar códigos expirados (opcional, para mantenimiento)
export const cleanupExpiredOTPs = async () => {
    await pool.query('DELETE FROM otp_codes WHERE expires_at < NOW()');
};