import mongoose from 'mongoose';
import Book from '../models/Book.js';
import dotenv from 'dotenv';

dotenv.config();

const listBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const books = await Book.find().populate('propietario', 'nombre email');
    
    console.log('\n📚 LIBROS EN LA BASE DE DATOS:');
    console.log('='.repeat(80));
    console.log(`Total de libros: ${books.length}\n`);
    
    if (books.length === 0) {
      console.log('No hay libros registrados.');
    } else {
      books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.titulo}`);
        console.log(`   ✍️  Autor: ${book.autor}`);
        console.log(`   📖 ISBN: ${book.isbn || 'No especificado'}`);
        console.log(`   📝 Descripción: ${book.descripcion.substring(0, 60)}...`);
        console.log(`   🏷️  Género: ${book.genero}`);
        console.log(`   📍 Estado: ${book.estado}`);
        console.log(`   💰 Disponible para: ${book.disponiblePara}`);
        console.log(`   👤 Propietario: ${book.propietario.nombre} (${book.propietario.email})`);
        console.log(`   🖼️  Foto: ${book.foto || 'Sin foto'}`);
        console.log(`   📅 Creado: ${book.createdAt.toLocaleDateString()}`);
        console.log(`   🆔 ID: ${book._id}`);
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

listBooks();
