import mongoose from 'mongoose';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Exchange from '../models/Exchange.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const listAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');
    
    const users = await User.countDocuments();
    const books = await Book.countDocuments();
    const exchanges = await Exchange.countDocuments();
    const messages = await Message.countDocuments();
    const reviews = await Review.countDocuments();
    
    console.log('📊 RESUMEN DE LA BASE DE DATOS');
    console.log('='.repeat(80));
    console.log(`👥 Usuarios:     ${users}`);
    console.log(`📚 Libros:       ${books}`);
    console.log(`🔄 Intercambios: ${exchanges}`);
    console.log(`💬 Mensajes:     ${messages}`);
    console.log(`⭐ Reviews:      ${reviews}`);
    console.log('='.repeat(80));
    
    // Estadísticas adicionales
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const availableBooks = await Book.countDocuments({ estado: 'disponible' });
    const pendingExchanges = await Exchange.countDocuments({ estado: 'pendiente' });
    
    console.log('\n📈 ESTADÍSTICAS ADICIONALES');
    console.log('='.repeat(80));
    console.log(`✅ Usuarios verificados: ${verifiedUsers}/${users}`);
    console.log(`📖 Libros disponibles:   ${availableBooks}/${books}`);
    console.log(`⏳ Intercambios pendientes: ${pendingExchanges}/${exchanges}`);
    console.log('='.repeat(80));
    
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listAll();
