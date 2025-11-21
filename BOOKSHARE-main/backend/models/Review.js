import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  intercambio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exchange',
    required: true
  },
  evaluador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  calificacion: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
