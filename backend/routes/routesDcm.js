import express from 'express';
import { User } from '../models/modelUser.js';
import { Paciente } from '../models/modelsPacientes.js';
import { Aranceles } from '../models/modelsAranceles.js';
import { Dcm } from '../models/modelsDcm.js';

const router = express.Router();

// Ruta para obtener todos los DCMs
router.get('/dcm', async (req, res) => {
  try {
    const dcms = await Dcm.find()
      .sort({ fecha_hora_creacion_dcm: -1 });

    console.log('DCMs encontrados:', dcms.length);
    res.json(dcms);
  } catch (error) {
    console.error('Error al obtener DCMs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los DCMs',
      error: error.message
    });
  }
});

// Ruta para obtener DCMs por RUT de paciente
router.get('/dcm/paciente/:rut', async (req, res) => {
  try {
    const dcms = await Dcm.find({ 
      paciente_rut: req.params.rut 
    }).sort({ fecha_hora_creacion_dcm: -1 });

    if (!dcms || dcms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron DCMs para este paciente'
      });
    }

    res.json(dcms);
  } catch (error) {
    console.error('Error al obtener DCMs del paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los DCMs del paciente',
      error: error.message
    });
  }
});

// Ruta para crear un DCM
router.post('/dcm/crear', async (req, res) => {
  try {
    console.log('Datos recibidos para crear DCM:', req.body);

    // Validar campos requeridos
    const camposRequeridos = [
      'paciente_rut',
      'paciente_dv',
      'nombre_completo_paciente',
      'prestacion_codigo',
      'prestacion_descripcion',
      'prestacion_valor'
    ];

    for (const campo of camposRequeridos) {
      if (!req.body[campo]) {
        return res.status(400).json({
          success: false,
          message: `El campo ${campo} es requerido`
        });
      }
    }

    // Crear el DCM
    const dcm = new Dcm(req.body);
    await dcm.save();

    console.log('DCM creado:', dcm);

    res.status(201).json({
      success: true,
      message: 'DCM creado exitosamente',
      data: dcm
    });

  } catch (error) {
    console.error('Error al crear DCM:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el DCM',
      error: error.message
    });
  }
});

// Ruta para buscar prestaciones
router.get('/prestaciones/buscar', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    console.log('Término de búsqueda:', searchTerm);
    
    if (!searchTerm) {
      return res.json([]);
    }

    const prestaciones = await Aranceles.find({
      $or: [
        { codigo_prestacion: { $regex: searchTerm, $options: 'i' } },
        { descrip_prestacion: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(10);
    
    console.log('Prestaciones encontradas:', prestaciones.length);
    res.json(prestaciones);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ 
      message: 'Error al buscar prestaciones',
      error: error.message 
    });
  }
});

// ----------------------- CRUD ----------------------- //
//Ruta para eliminar un paciente
router.delete('/pacientes/:rut', async (req, res) => {
  try {
    const paciente = await Paciente.findOneAndDelete({ rut_paciente: req.params.rut });

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json({ message: 'Paciente eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
