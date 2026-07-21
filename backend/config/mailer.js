'use strict';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false // Evita bloqueos por certificados auto-firmados en la nube
    },
    // Opciones recomendadas para estabilidad en Render y evitar ENETUNREACH/Timeouts:
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

// Opcional: verificar la conexión al iniciar para detectar errores en los logs de Render
transporter.verify(function (error, success) {
    if (error) {
        console.error('Error en la configuración de Nodemailer:', error);
    } else {
        console.log('Nodemailer listo para enviar correos.');
    }
});

module.exports = transporter;