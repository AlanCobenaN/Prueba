import mongoose from 'mongoose';
import Exchange from '../models/Exchange.js';
import dotenv from 'dotenv';

dotenv.config();

const listExchanges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const exchanges = await Exchange.find()
      .populate('solicitante', 'nombre email')
      .populate('propietario', 'nombre email')
      .populate('libroSolicitado', 'titulo autor')
      .populate('libroOfrecido', 'titulo autor');
    
    console.log('\n🔄 INTERCAMBIOS EN LA BASE DE DATOS:');
    console.log('='.repeat(80));
    console.log(`Total de intercambios: ${exchanges.length}\n`);
    
    if (exchanges.length === 0) {
      console.log('No hay intercambios registrados.');
    } else {
      exchanges.forEach((exchange, index) => {
        console.log(`${index + 1}. Intercambio #${exchange._id}`);
        console.log(`   📖 Libro solicitado: ${exchange.libroSolicitado.titulo} (${exchange.libroSolicitado.autor})`);
        console.log(`   📚 Libro ofrecido: ${exchange.libroOfrecido ? `${exchange.libroOfrecido.titulo} (${exchange.libroOfrecido.autor})` : 'Ninguno (Préstamo)'}`);
        console.log(`   👤 Solicitante: ${exchange.solicitante.nombre} (${exchange.solicitante.email})`);
        console.log(`   👤 Propietario: ${exchange.propietario.nombre} (${exchange.propietario.email})`);
        console.log(`   📍 Estado: ${exchange.estado}`);
        console.log(`   🔄 Tipo: ${exchange.tipoIntercambio}`);
        console.log(`   📅 Creado: ${exchange.createdAt.toLocaleDateString()}`);
        console.log(`   📅 Actualizado: ${exchange.updatedAt.toLocaleDateString()}`);
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

listExchanges();
