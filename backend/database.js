import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('debug', true);
    const conn = await mongoose.connect('mongodb+srv://kevinnavarrete:logfAQ08EnUSnkcO@project-dcm-cluster.oywyv.mongodb.net/dcm-db');
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;



