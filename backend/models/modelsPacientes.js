import mongoose from 'mongoose';

const PacienteSchema = mongoose.Schema({
  rut_paciente: String,
  dv_paciente: String,
  nombre_pcte: String,  
  appaterno_pcte: String,  
  apmaterno_pcte: String, 
  contacto_pcte: String,   
  correo_pcte: String,     
  prevision: String
});

export const Paciente = mongoose.model('Paciente', PacienteSchema, 'creacion_paciente');