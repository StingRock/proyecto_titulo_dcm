import express from 'express';
import cors from 'cors';
import connectDB from './database.js';
import dotenv from 'dotenv';
import userRoutes from './routes/routesDcm.js';
import pacientesRoutes from './routes/routesDcm.js';
import buscarPacientesRoutes from './routes/routesDcm.js'

const app = express();

dotenv.config();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Middlewares para logging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Body:`, req.body);
  next();
});

// Rutas
app.use('/api', userRoutes);
app.use('/api', pacientesRoutes);
app.use('/api', buscarPacientesRoutes);

// Middlewares para el manejo de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Conexión a la base de datos
connectDB();

// Inicia el servidor
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
