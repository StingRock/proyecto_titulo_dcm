import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://kevinnavarrete:logfAQ08EnUSnkcO@project-dcm-cluster.oywyv.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error de conexión a MongoDB Atlas:', error);
    process.exit(1);
  }
};

export default connectDB;
