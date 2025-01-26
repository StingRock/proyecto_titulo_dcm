import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    
    password: { type: String, required: true },
    nombre_funcionario: { type: String, required: true },
    usuario: { type: String, required: true, unique: true },
    tipo_usuario: { type: Number, enum: [1, 2], default: 2 }
});

export const User = mongoose.model('User', UserSchema, 'usuarios');