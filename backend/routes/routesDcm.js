import express from 'express';
//  import { Dcm } from '../models/modelsDcm.js';
import { User } from '../models/modelUser.js';

const router = express.Router();

// Ruta para validar usuario (login)
router.post('/validateUser', async (req, res) => {
    try {
      console.log('Datos recibidos:', req.body);
  
      const { usuario, password } = req.body;
  
      if (!usuario || !password) {
        return res.status(400).json({ valid: false, message: 'Usuario y contraseña son requeridos' });
      }
  
      const user = await User.findOne({ usuario: usuario.toLowerCase() });
      if (!user) {
        return res.status(404).json({ valid: false, message: 'Usuario no encontrado' });
      }
  
      if (user.password === password) {
        return res.status(200).json({ valid: true, message: 'Inicio de sesión exitoso' });
      }
  
      return res.status(401).json({ valid: false, message: 'Contraseña incorrecta' });
    } catch (error) {
      console.error('Error en el servidor:', error); // Asegúrate de registrar el error
      return res.status(500).json({ valid: false, message: 'Error interno del servidor' });
    }
  });
  

export default router;
