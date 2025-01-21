import mongoose from 'mongoose';

// Definición de UserSchema
const UserSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export const User = mongoose.model('User', UserSchema, 'usuarios');