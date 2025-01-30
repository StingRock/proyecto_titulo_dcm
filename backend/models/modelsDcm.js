import mongoose from 'mongoose';

const DcmSchema = new mongoose.Schema({
    
    descripcion_dcm: { type: String, default: '' },
    fecha_hora_creacion_dcm: { type: Date, default: Date.now },
    contacto_paciente: { type: String, default: '' },
    correo_paciente: { type: String, default: '' },
    nombre_completo_paciente: { type: String, required: true },
    paciente_dv: { type: String, required: true },
    paciente_rut: { type: String, required: true },
    prestacion_codigo: { type: String, required: true },
    prestacion_descripcion: { type: String, required: true },
    prestacion_valor: { type: String, required: true },
    prevision_paciente: { type: String, default: '' },
    usuario_responsable: { type: String, default: '' }
});

export const Dcm = mongoose.model('Dcm', DcmSchema, 'creacion_dcm');
