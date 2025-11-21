import mongoose from 'mongoose';
import Message from '../models/Message.js';
import dotenv from 'dotenv';

dotenv.config();

const listMessages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const messages = await Message.find()
      .populate('remitente', 'nombre email')
      .populate('destinatario', 'nombre email')
      .sort({ createdAt: -1 });
    
    console.log('\n💬 MENSAJES EN LA BASE DE DATOS:');
    console.log('='.repeat(80));
    console.log(`Total de mensajes: ${messages.length}\n`);
    
    if (messages.length === 0) {
      console.log('No hay mensajes registrados.');
    } else {
      messages.forEach((message, index) => {
        console.log(`${index + 1}. Mensaje #${message._id}`);
        console.log(`   👤 De: ${message.remitente.nombre} (${message.remitente.email})`);
        console.log(`   👤 Para: ${message.destinatario.nombre} (${message.destinatario.email})`);
        console.log(`   💬 Contenido: ${message.contenido.substring(0, 60)}${message.contenido.length > 60 ? '...' : ''}`);
        console.log(`   📖 Leído: ${message.leido ? 'Sí' : 'No'}`);
        console.log(`   📅 Enviado: ${message.createdAt.toLocaleString()}`);
        console.log('-'.repeat(80));
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listMessages();
