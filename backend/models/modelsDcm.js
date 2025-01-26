import mongoose from 'mongoose';

// Definición de ArancelSchema
const ArancelSchema = new mongoose.Schema({
    codigo_prestacion: { type: String, required: true },
    descrip_prestacion: { type: String, required: true },
    valor_prestacion: { type: Number, required: true }
});

// Definición de DcmSchema
const DcmSchema = new mongoose.Schema({
    descripcion_dcm: { type: String, required: true },
    hora_creacion_dcm: { type: String, required: true },
    fecha_creacion_dcm: { type: Date, required: true },
    arancel: { type: ArancelSchema, required: true }
});

export const Paciente = mongoose.model('Paciente', PacienteSchema);
