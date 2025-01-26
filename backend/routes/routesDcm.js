import express from 'express';
import { User } from '../models/modelUser.js';
import { Paciente } from '../models/modelsPacientes.js';

const router = express.Router();

// Ruta para buscar un paciente
router.get('/pacientes/:rut', async (req, res) => {
  try {
    const paciente = await Paciente.findOne({ rut_paciente: req.params.rut });
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar un paciente
router.put('/pacientes/:rut', async (req, res) => {
  try {
    const paciente = await Paciente.findOneAndUpdate(
      { rut_paciente: req.params.rut },
      req.body,
      { new: true }
    );
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para crear un paciente
router.post('/pacientes', async (req, res) => {
  try {
    const pacienteExistente = await Paciente.findOne({ rut_paciente: req.body.rut_paciente });
    if (pacienteExistente) {
      return res.status(400).json({ message: 'El paciente ya existe' });
    }
    const paciente = new Paciente(req.body);
    await paciente.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para validar usuario
router.post('/validateUser', async (req, res) => {
  console.log('Solicitud recibida:', {
    body: req.body,
    headers: req.headers
  });

  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      console.log('Datos faltantes');
      return res.status(400).json({ 
        valid: false, 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    const user = await User.findOne({ usuario: usuario.toLowerCase() });
    
    if (!user) {
      console.log('Usuario no encontrado:', usuario);
      return res.status(404).json({ 
        valid: false, 
        message: 'Usuario no encontrado' 
      });
    }

    if (user.password !== password) {
      console.log('Contraseña incorrecta para usuario:', usuario);
      return res.status(401).json({ 
        valid: false, 
        message: 'Contraseña incorrecta' 
      });
    }

    return res.status(200).json({ 
      valid: true, 
      message: 'Inicio de sesión exitoso',
      tipo_usuario: user.tipo_usuario.toString()
    });

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    return res.status(500).json({ 
      valid: false, 
      message: 'Error interno del servidor',
      errorDetails: error.message 
    });
  }
});

export default router;
