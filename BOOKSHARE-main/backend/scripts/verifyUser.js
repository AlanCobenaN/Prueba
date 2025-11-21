import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ No se encontró el usuario con email: ${email}`);
      process.exit(1);
    }
    
    console.log('\n👤 Usuario encontrado:');
    console.log(`   Nombre: ${user.nombre}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Estado actual: ${user.isVerified ? '✅ Verificado' : '❌ No verificado'}`);
    
    if (user.isVerified) {
      console.log('\n⚠️  El usuario ya está verificado');
    } else {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
      
      console.log('\n✅ Usuario verificado exitosamente');
    }
    
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const email = process.argv[2] || 'jhonnyccm11@gmail.com';
verifyUser(email);
