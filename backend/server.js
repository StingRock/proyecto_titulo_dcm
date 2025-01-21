import express from 'express';
import cors from 'cors';
import connectDB from './database.js';
import bodyParser from 'body-parser';
import userRoutes from './routes/routesDcm.js';

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173'], // Permite solicitudes desde este dominio (Vite)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api', userRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
