import mongoose from 'mongoose';

const exchangeSchema = new mongoose.Schema({
  solicitante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  tipo: {
    type: String,
    enum: ['Intercambio', 'Préstamo'],
    required: true
  },
  libroOfrecido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: function() {
      return this.tipo === 'Intercambio';
    }
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aceptado', 'Rechazado', 'Completado', 'Cancelado'],
    default: 'Pendiente'
  },
  mensaje: {
    type: String,
    trim: true
  },
  fechaEntrega: {
    type: Date
  },
  fechaDevolucion: {
    type: Date
  }
}, {
  timestamps: true
});

const Exchange = mongoose.model('Exchange', exchangeSchema);

export default Exchange;
