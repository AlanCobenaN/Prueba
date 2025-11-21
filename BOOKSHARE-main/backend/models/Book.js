import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'El autor es requerido'],
    trim: true
  },
  materia: {
    type: String,
    required: [true, 'La materia es requerida'],
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  editorial: {
    type: String,
    trim: true
  },
  edicion: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ['Nuevo', 'Como nuevo', 'Bueno', 'Aceptable', 'Desgastado'],
    required: [true, 'El estado es requerido']
  },
  descripcion: {
    type: String,
    trim: true
  },
  foto: {
    type: String,
    default: 'default-book.jpg'
  },
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  tipoOferta: {
    type: String,
    enum: ['Intercambio', 'Préstamo', 'Ambos'],
    default: 'Ambos'
  }
}, {
  timestamps: true
});

// Índices para búsqueda
bookSchema.index({ titulo: 'text', autor: 'text', materia: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;
