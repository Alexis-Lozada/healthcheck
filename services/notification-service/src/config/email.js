const sgMail = require('@sendgrid/mail');

// Configurar API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configuración común para los emails
const emailDefaults = {
  from: {
    name: 'HealthCheck',
    email: process.env.EMAIL_FROM || 'notifications@healthcheck.news'
  }
};

module.exports = {
  sendGrid: sgMail,
  emailDefaults
};