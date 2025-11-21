import Exchange from '../models/Exchange.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

// Crear solicitud de intercambio
export const createExchange = async (req, res) => {
  try {
    const { libroId, tipo, libroOfrecidoId, mensaje } = req.body;

    // Validar tipo
    if (!tipo || !['Intercambio', 'Préstamo'].includes(tipo)) {
      return res.status(400).json({ 
        success: false,
        message: 'Tipo de solicitud inválido. Debe ser "Intercambio" o "Préstamo"' 
      });
    }

    // Verificar que el libro existe
    const libro = await Book.findById(libroId);
    if (!libro) {
      return res.status(404).json({ 
        success: false,
        message: 'Libro no encontrado' 
      });
    }

    // Verificar que el libro está disponible
    if (!libro.disponible) {
      return res.status(400).json({ 
        success: false,
        message: 'El libro no está disponible' 
      });
    }

    // No permitir solicitudes propias
    if (libro.propietario.toString() === req.user.id) {
      return res.status(400).json({ 
        success: false,
        message: 'No puedes solicitar tu propio libro' 
      });
    }

    // Si es intercambio, validar libro ofrecido
    if (tipo === 'Intercambio') {
      if (!libroOfrecidoId) {
        return res.status(400).json({ 
          success: false,
          message: 'Para un intercambio debes ofrecer un libro propio' 
        });
      }

      // Verificar que el libro ofrecido existe y pertenece al solicitante
      const libroOfrecido = await Book.findById(libroOfrecidoId);
      if (!libroOfrecido) {
        return res.status(404).json({ 
          success: false,
          message: 'El libro ofrecido no existe' 
        });
      }

      if (libroOfrecido.propietario.toString() !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'Solo puedes ofrecer tus propios libros' 
        });
      }

      if (!libroOfrecido.disponible) {
        return res.status(400).json({ 
          success: false,
          message: 'El libro que ofreces no está disponible' 
        });
      }
    }

    const exchangeData = {
      solicitante: req.user.id,
      propietario: libro.propietario,
      libro: libroId,
      tipo,
      mensaje
    };

    if (tipo === 'Intercambio' && libroOfrecidoId) {
      exchangeData.libroOfrecido = libroOfrecidoId;
    }

    const exchange = await Exchange.create(exchangeData);
    await exchange.populate([
      { path: 'solicitante', select: 'nombre universidad' },
      { path: 'propietario', select: 'nombre universidad' },
      { path: 'libro', select: 'titulo autor foto' },
      { path: 'libroOfrecido', select: 'titulo autor foto' }
    ]);

    res.status(201).json({
      success: true,
      message: `Solicitud de ${tipo.toLowerCase()} enviada exitosamente`,
      exchange
    });
  } catch (error) {
    console.error('Error al crear intercambio:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear intercambio', 
      error: error.message 
    });
  }
};

// Obtener solicitudes recibidas
export const getReceivedExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({ propietario: req.user.id })
      .populate('solicitante', 'nombre universidad calificacion')
      .populate('libro', 'titulo autor foto')
      .populate('libroOfrecido', 'titulo autor foto')
      .sort({ createdAt: -1 });

    res.json({ success: true, exchanges });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitudes', error: error.message });
  }
};

// Obtener solicitudes enviadas
export const getSentExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({ solicitante: req.user.id })
      .populate('propietario', 'nombre universidad calificacion')
      .populate('libro', 'titulo autor foto')
      .populate('libroOfrecido', 'titulo autor foto')
      .sort({ createdAt: -1 });

    res.json({ success: true, exchanges });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitudes', error: error.message });
  }
};

// Actualizar estado de intercambio
export const updateExchangeStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Intercambio no encontrado' });
    }

    // Solo el propietario puede aceptar/rechazar
    if (exchange.propietario.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    exchange.estado = estado;

    // Si se acepta, marcar libro como no disponible
    if (estado === 'Aceptado') {
      await Book.findByIdAndUpdate(exchange.libro, { disponible: false });
    }

    await exchange.save();

    res.json({
      success: true,
      message: `Solicitud ${estado.toLowerCase()} exitosamente`,
      exchange
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar intercambio', error: error.message });
  }
};

// Completar intercambio
export const completeExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Intercambio no encontrado' });
    }

    exchange.estado = 'Completado';
    await exchange.save();

    // Incrementar número de intercambios de ambos usuarios
    await User.findByIdAndUpdate(exchange.solicitante, { $inc: { numeroIntercambios: 1 } });
    await User.findByIdAndUpdate(exchange.propietario, { $inc: { numeroIntercambios: 1 } });

    res.json({
      success: true,
      message: 'Intercambio completado exitosamente',
      exchange
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al completar intercambio', error: error.message });
  }
};
