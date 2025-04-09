require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const routes = require('./routes');
const schedulerService = require('./services/scheduler.service');
const logger = require('./utils/logger');

// Inicializar la aplicación Express
const app = express();

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Permitir origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Registrar rutas
app.use('/api', routes);

// Endpoint de estado
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  logger.info(`Servicio iniciado en puerto ${PORT}`);
  
  // Ejecutar inmediatamente al iniciar el servicio
  logger.info('Ejecutando verificación inicial de notificaciones...');
  try {
    await schedulerService.processUnsentNotifications();
    await schedulerService.generateFalseNewsNotifications();
    logger.info('Verificación inicial completada');
  } catch (error) {
    logger.error('Error en verificación inicial:', error);
  }
});

// Configurar la tarea programada para procesar notificaciones pendientes y generar nuevas
schedulerService.startScheduler();

module.exports = app;