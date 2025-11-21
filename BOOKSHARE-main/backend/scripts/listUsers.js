import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const users = await User.find().select('-password');
    
    console.log('\n📋 USUARIOS EN LA BASE DE DATOS:');
    console.log('='.repeat(80));
    console.log(`Total de usuarios: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombre}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🏫 Universidad: ${user.universidad || 'No especificada'}`);
      console.log(`   📚 Carrera: ${user.carrera || 'No especificada'}`);
      console.log(`   📱 Teléfono: ${user.telefono || 'No especificado'}`);
      console.log(`   ✅ Verificado: ${user.isVerified ? 'Sí' : 'No'}`);
      console.log(`   📅 Registrado: ${user.createdAt.toLocaleDateString()}`);
      console.log(`   🆔 ID: ${user._id}`);
      console.log('-'.repeat(80));
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listUsers();
