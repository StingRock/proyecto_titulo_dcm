import { MongoClient } from 'mongodb';

// Connection string de MongoDB Atlas
const uri = 'mongodb+srv://kevinnavarrete:logfAQ08EnUSnkcO@project-dcm-cluster.oywyv.mongodb.net/';

// Crear un cliente de MongoDB
const client = new MongoClient(uri);

async function run() {
  try {
    // Intentar conectar al servidor
    await client.connect();
    console.log("Conexión exitosa a MongoDB Atlas");

    // Listar las bases de datos como prueba
    const databases = await client.db().admin().listDatabases();
    console.log("Bases de datos disponibles:");
    databases.databases.forEach(db => console.log(`- ${db.name}`));
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error.message);
  } finally {
    // Cerrar la conexión
    await client.close();
  }
}

run().catch(console.dir);
