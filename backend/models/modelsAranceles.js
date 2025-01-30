import mongoose from 'mongoose';

const ArancelSchema = new mongoose.Schema({
    codigo_prestacion: { type: String, required: true },
    descrip_prestacion: { type: String, required: true },
    valor_prestacion: { type: String, required: true }
});

export const Aranceles = mongoose.model('Aranceles', ArancelSchema, 'aranceles_exms_medic');