import express from 'express';
import cors from 'cors';
import connectDB from './database.js';
import dotenv from 'dotenv';
import routes from './routes/routesDcm.js';

const app = express();

dotenv.config();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Middlewares para logging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Body:`, req.body);
  next();
});

// Ruta
app.use('/api', routes);

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
