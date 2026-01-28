const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anuies-tecnm');

    console.log(`MongoDB conectado: ${conn.connection.db.databaseName}`);
    
    // Manejo de eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });

    // Cerrar conexión al terminar la aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    // En Vercel (serverless) no usar process.exit para no tumbar la función
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    // En Vercel solo registrar; las peticiones devolverán error hasta que MONGODB_URI esté configurado
  }
};

module.exports = connectDB;

