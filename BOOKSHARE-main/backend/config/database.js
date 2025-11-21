import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookshare';
    if (!process.env.MONGODB_URI) {
      console.warn(
        'Advertencia: MONGODB_URI no definida. Usando URI por defecto mongodb://localhost:27017/bookshare. Para entornos de producción, define MONGODB_URI en un archivo .env o en las variables de entorno.'
      );
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
