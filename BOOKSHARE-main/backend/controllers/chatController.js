import Message from '../models/Message.js';

// Enviar mensaje
export const sendMessage = async (req, res) => {
  try {
    const { destinatarioId, contenido } = req.body;

    // Validar que no se envíe mensaje a sí mismo
    if (req.user.id === destinatarioId) {
      return res.status(400).json({ 
        success: false,
        message: 'No puedes enviarte mensajes a ti mismo' 
      });
    }

    const message = await Message.create({
      remitente: req.user.id,
      destinatario: destinatarioId,
      contenido
    });

    await message.populate([
      { path: 'remitente', select: 'nombre avatar' },
      { path: 'destinatario', select: 'nombre avatar' }
    ]);

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar mensaje', error: error.message });
  }
};

// Obtener conversación con un usuario
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { remitente: req.user.id, destinatario: userId },
        { remitente: userId, destinatario: req.user.id }
      ]
    })
      .populate('remitente', 'nombre avatar')
      .populate('destinatario', 'nombre avatar')
      .sort({ createdAt: 1 });

    // Marcar mensajes como leídos
    await Message.updateMany(
      { remitente: userId, destinatario: req.user.id, leido: false },
      { leido: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener conversación', error: error.message });
  }
};

// Obtener lista de conversaciones
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { remitente: userId },
                { destinatario: userId }
              ]
            },
            {
              $expr: { $ne: ['$remitente', '$destinatario'] }
            }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$remitente', userId] },
              '$destinatario',
              '$remitente'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.remitente',
          foreignField: '_id',
          as: 'remitenteInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.destinatario',
          foreignField: '_id',
          as: 'destinatarioInfo'
        }
      },
      {
        $addFields: {
          'lastMessage.remitente': {
            $arrayElemAt: [
              {
                $map: {
                  input: '$remitenteInfo',
                  as: 'r',
                  in: {
                    _id: '$$r._id',
                    nombre: '$$r.nombre',
                    avatar: '$$r.avatar'
                  }
                }
              },
              0
            ]
          },
          'lastMessage.destinatario': {
            $arrayElemAt: [
              {
                $map: {
                  input: '$destinatarioInfo',
                  as: 'd',
                  in: {
                    _id: '$$d._id',
                    nombre: '$$d.nombre',
                    avatar: '$$d.avatar'
                  }
                }
              },
              0
            ]
          }
        }
      },
      {
        $project: {
          remitenteInfo: 0,
          destinatarioInfo: 0
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    console.log(`📋 Conversaciones para usuario ${userId}:`, conversations.length);
    if (conversations.length > 0) {
      console.log('Primera conversación:', JSON.stringify(conversations[0], null, 2));
    }

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ message: 'Error al obtener conversaciones', error: error.message });
  }
};
