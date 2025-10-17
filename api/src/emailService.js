import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendOTPEmail = async (email, code, purpose) => {
    const subject = purpose === 'login' ? 'Código de verificación para inicio de sesión' :
                   purpose === 'register' ? 'Verifica tu correo electrónico' :
                   'Código para restablecer contraseña';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${subject}</h2>
            <p>Tu código de verificación es:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
            </div>
            <p>Este código expira en 10 minutos.</p>
            <p>Si no solicitaste este código, ignora este correo.</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: subject,
            html: html
        });
        return true;
    } catch (error) {
        console.error('Error enviando correo:', error);
        return false;
    }
};