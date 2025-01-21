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

// Definición de PacienteSchema
const PacienteSchema = new mongoose.Schema({
    rut_paciente: { type: Number, required: true, unique: true },
    dv_paciente: { type: Number, required: true },
    nombre_pcte: { type: String, required: true },
    appaterno_pcte: { type: String, required: true },
    apmaterno_pcte: { type: String, required: true },
    contacto_pcte: { type: Number, required: true },
    correo_pcte: { type: String, required: true, unique: true },
    prevision: { type: String, required: true },
    dcm: { type: [DcmSchema], required: true }
}, { timestamps: true });


export const Paciente = mongoose.model('Paciente', PacienteSchema);
