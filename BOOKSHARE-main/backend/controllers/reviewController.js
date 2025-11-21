import Review from '../models/Review.js';
import User from '../models/User.js';
import Exchange from '../models/Exchange.js';

// Crear una reseña
export const createReview = async (req, res) => {
  try {
    const { intercambioId, evaluadoId, calificacion, comentario } = req.body;

    // Verificar que el intercambio existe y está completado
    const exchange = await Exchange.findById(intercambioId);
    if (!exchange) {
      return res.status(404).json({ message: 'Intercambio no encontrado' });
    }

    if (exchange.estado !== 'Completado') {
      return res.status(400).json({ message: 'Solo puedes evaluar intercambios completados' });
    }

    // Verificar que el usuario es parte del intercambio
    const isParticipant = 
      exchange.solicitante.toString() === req.user.id || 
      exchange.propietario.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: 'No eres parte de este intercambio' });
    }

    // Verificar que no haya evaluado antes
    const existingReview = await Review.findOne({
      intercambio: intercambioId,
      evaluador: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Ya evaluaste este intercambio' });
    }

    const review = await Review.create({
      intercambio: intercambioId,
      evaluador: req.user.id,
      evaluado: evaluadoId,
      calificacion,
      comentario
    });

    // Actualizar calificación promedio del usuario evaluado
    const reviews = await Review.find({ evaluado: evaluadoId });
    const avgRating = reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length;
    await User.findByIdAndUpdate(evaluadoId, { calificacion: avgRating.toFixed(1) });

    res.status(201).json({
      success: true,
      message: 'Evaluación registrada exitosamente',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear reseña', error: error.message });
  }
};

// Obtener reseñas de un usuario
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ evaluado: req.params.userId })
      .populate('evaluador', 'nombre universidad')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
};
