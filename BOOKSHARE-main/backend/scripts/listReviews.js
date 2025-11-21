import mongoose from 'mongoose';
import Review from '../models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const listReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const reviews = await Review.find()
      .populate('revisor', 'nombre email')
      .populate('revisado', 'nombre email')
      .sort({ createdAt: -1 });
    
    console.log('\n⭐ REVIEWS EN LA BASE DE DATOS:');
    console.log('='.repeat(80));
    console.log(`Total de reviews: ${reviews.length}\n`);
    
    if (reviews.length === 0) {
      console.log('No hay reviews registradas.');
    } else {
      reviews.forEach((review, index) => {
        console.log(`${index + 1}. Review #${review._id}`);
        console.log(`   👤 Revisor: ${review.revisor.nombre} (${review.revisor.email})`);
        console.log(`   👤 Revisado: ${review.revisado.nombre} (${review.revisado.email})`);
        console.log(`   ⭐ Calificación: ${'⭐'.repeat(review.calificacion)} (${review.calificacion}/5)`);
        console.log(`   💬 Comentario: ${review.comentario ? review.comentario.substring(0, 60) + '...' : 'Sin comentario'}`);
        console.log(`   📅 Creado: ${review.createdAt.toLocaleDateString()}`);
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

listReviews();
