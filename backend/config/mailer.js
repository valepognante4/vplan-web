'use strict';
const nodemailer = require('nodemailer');

/**
 * Transporter de Nodemailer configurado a partir de las variables de entorno SMTP.
 * Se crea una única instancia (singleton) para toda la app.
 *
 * Variables de entorno requeridas:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 */
const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true', // true → SSL/TLS (port 465)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

module.exports = transporter;
