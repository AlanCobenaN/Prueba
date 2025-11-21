import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { useSocket } from '../hooks/useSocket';
import { toast } from 'react-toastify';
import { 
  FaPaperPlane, 
  FaUser, 
  FaCircle,
  FaArrowLeft 
} from 'react-icons/fa';

const Chat = () => {
  const { userId: selectedUserId } = useParams();
  const { user } = useAuth();
  
  // OBTENER ID DEL USUARIO - soportar ambos formatos
  const myUserId = user?.id || user?._id;
  
  const socket = useSocket(myUserId);
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // LOG para depuración
  useEffect(() => {
    if (user) {
      console.log('👤 Usuario logueado:', user);
      console.log('🆔 ID del usuario:', myUserId);
    }
  }, [user, myUserId]);

  // Scroll automático a los últimos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar conversaciones
  useEffect(() => {
    fetchConversations();
  }, []);

  // Configurar socket listeners - VERSIÓN CORREGIDA
  useEffect(() => {
    if (!socket || !user) {
      console.log('⚠️ Socket o user no disponible aún');
      return;
    }

    console.log('✅ Configurando listeners de socket...', socket.id);

    // Recibir lista inicial de usuarios en línea
    const handleOnlineUsersList = (usersList) => {
      console.log('📥 Lista de usuarios en línea recibida:', usersList);
      setOnlineUsers(new Set(usersList));
    };

    // Usuario conectado/desconectado
    const handleUserStatusChange = ({ userId, online }) => {
      console.log(`👤 Usuario ${userId} está ${online ? 'EN LÍNEA ✅' : 'DESCONECTADO ❌'}`);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (online) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        console.log('👥 Usuarios en línea ahora:', Array.from(newSet));
        return newSet;
      });
    };

    // Recibir mensaje en tiempo real - CRÍTICO
    const handleReceiveMessage = (data) => {
      console.log('� ¡MENSAJE RECIBIDO POR SOCKET!', data);
      const message = data.message || data;
      
      console.log('📨 Contenido del mensaje:', message.contenido);
      console.log('👤 Remitente:', message.remitente);
      
      // Agregar mensaje INMEDIATAMENTE
      setMessages(prev => {
        const exists = prev.some(msg => msg._id === message._id);
        if (exists) {
          console.log('⚠️ Mensaje duplicado, ignorando');
          return prev;
        }
        console.log('✅ AGREGANDO MENSAJE A LA LISTA');
        const newMessages = [...prev, message];
        console.log('📊 Total mensajes ahora:', newMessages.length);
        return newMessages;
      });
      
      fetchConversations();
    };

    // Usuario escribiendo
    const handleUserTyping = () => {
      console.log('✍️ Usuario está escribiendo...');
      setIsTyping(true);
    };

    const handleUserStopTyping = () => {
      console.log('✋ Usuario dejó de escribir');
      setIsTyping(false);
    };

    // Notificación de nuevo mensaje
    const handleNewMessageNotification = ({ from, message }) => {
      console.log('🔔 Notificación de mensaje de:', from);
      if (selectedUser?._id !== from) {
        toast.info('Nuevo mensaje recibido');
      }
    };

    // REGISTRAR LISTENERS
    socket.on('online-users-list', handleOnlineUsersList);
    socket.on('user-status-change', handleUserStatusChange);
    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);
    socket.on('new-message-notification', handleNewMessageNotification);

    console.log('✅ Listeners registrados correctamente');

    // CLEANUP
    return () => {
      console.log('🧹 Limpiando listeners...');
      socket.off('online-users-list', handleOnlineUsersList);
      socket.off('user-status-change', handleUserStatusChange);
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
      socket.off('new-message-notification', handleNewMessageNotification);
    };
  }, [socket, user]);

  // Cargar conversación cuando se selecciona un usuario desde URL
  useEffect(() => {
    if (selectedUserId && user) {
      loadConversation(selectedUserId);
    }
  }, [selectedUserId, user]);

  const fetchConversations = async () => {
    try {
      console.log('📡 Solicitando conversaciones al backend...');
      const data = await chatService.getConversations();
      console.log('📥 Conversaciones recibidas:', data);
      console.log('📊 Total conversaciones:', data.conversations?.length || 0);
      setConversations(data.conversations || []);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error al cargar conversaciones:', error);
      setLoading(false);
    }
  };

  const loadConversation = async (userIdOrObject) => {
    try {
      setLoading(true);
      
      // Si recibimos un objeto de usuario directamente, usarlo
      let otherUser = null;
      let userId = null;
      
      if (typeof userIdOrObject === 'object') {
        otherUser = userIdOrObject;
        userId = userIdOrObject._id;
      } else {
        userId = userIdOrObject;
        
        // Buscar el usuario en las conversaciones existentes
        const conversation = conversations.find(c => {
          const remitente = c.lastMessage?.remitente;
          const destinatario = c.lastMessage?.destinatario;
          return (remitente?._id === userId || destinatario?._id === userId);
        });
        
        if (conversation?.lastMessage) {
          otherUser = conversation.lastMessage.remitente._id === myUserId 
            ? conversation.lastMessage.destinatario 
            : conversation.lastMessage.remitente;
        } else {
          // Si no hay conversación previa, obtener info del usuario directamente
          try {
            const userResponse = await chatService.getUserById(userId);
            otherUser = userResponse.user;
          } catch (error) {
            console.error('Error al obtener usuario:', error);
          }
        }
      }
      
      if (!otherUser) {
        console.error('No se pudo obtener la información del usuario');
        toast.error('Error al cargar conversación');
        setLoading(false);
        return;
      }
      
      // Cargar mensajes de la conversación
      const data = await chatService.getConversation(userId);
      setMessages(data.messages || []);
      
      setSelectedUser(otherUser);
      console.log('Usuario seleccionado:', otherUser);
      console.log('Usuarios en línea:', Array.from(onlineUsers));

      // Unirse a la sala de chat
      if (socket) {
        const chatRoom = getChatRoom(myUserId, userId);
        console.log('Uniéndose a sala de chat:', chatRoom);
        socket.emit('join-chat', chatRoom);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar conversación:', error);
      toast.error('Error al cargar conversación');
      setLoading(false);
    }
  };

  const getChatRoom = (userId1, userId2) => {
    return [userId1, userId2].sort().join('-');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedUser) {
      console.log('⚠️ No se puede enviar: input vacío o sin usuario seleccionado');
      return;
    }

    const messageContent = messageInput.trim();
    setMessageInput(''); // Limpiar input inmediatamente

    console.log('📤 Enviando mensaje:', messageContent);

    try {
      // Guardar en base de datos
      const response = await chatService.sendMessage(
        selectedUser._id,
        messageContent
      );

      console.log('✅ Mensaje guardado en BD:', response.message);

      // Agregar mensaje localmente
      const newMessage = response.message;
      setMessages(prev => [...prev, newMessage]);

      // Enviar por socket si está disponible
      if (socket && socket.connected) {
        const chatRoom = getChatRoom(myUserId, selectedUser._id);
        console.log('🔌 Emitiendo mensaje por socket a sala:', chatRoom);
        console.log('Datos del mensaje:', {
          chatRoom,
          message: newMessage,
          remitente: myUserId,
          destinatario: selectedUser._id
        });
        
        socket.emit('send-message', {
          chatRoom,
          message: newMessage,
          remitente: myUserId,
          destinatario: selectedUser._id
        });

        // Detener indicador de escritura
        socket.emit('stop-typing', {
          chatRoom,
          userId: myUserId
        });
      } else {
        console.warn('⚠️ Socket no conectado, mensaje no enviado en tiempo real');
      }
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      toast.error('Error al enviar mensaje');
      setMessageInput(messageContent); // Restaurar el mensaje si falla
    }
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    if (!socket || !selectedUser) return;

    const chatRoom = getChatRoom(myUserId, selectedUser._id);

    // Emitir evento de escritura
    socket.emit('typing', {
      chatRoom,
      userId: myUserId,
      nombre: user.nombre
    });

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Detener indicador después de 1 segundo de inactividad
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', {
        chatRoom,
        userId: myUserId
      });
    }, 1000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !selectedUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-amber-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
        💬 Chat
      </h1>
      
      <div className="grid md:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Lista de conversaciones */}
        <div className={`card overflow-y-auto ${selectedUser ? 'hidden md:block' : ''}`}>
          <h2 className="text-xl font-semibold mb-4 text-amber-900">Conversaciones</h2>
          
          {conversations.length === 0 ? (
            <div className="text-center py-8 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-700 font-semibold">📭 No tienes conversaciones aún</p>
              <p className="text-sm text-amber-600 mt-2">
                Ve a "Usuarios" y haz clic en "Chat" para iniciar una conversación
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv, index) => {
                console.log(`Conversación ${index}:`, conv);
                
                const otherUser = conv.lastMessage?.remitente?._id === myUserId 
                  ? conv.lastMessage?.destinatario 
                  : conv.lastMessage?.remitente;
                
                console.log(`Usuario de la conversación ${index}:`, otherUser);
                
                // No mostrar si no hay usuario o si es una conversación contigo mismo
                if (!otherUser || otherUser._id === myUserId) {
                  console.warn(`⚠️ Conversación ${index} sin usuario válido o es consigo mismo`);
                  return null;
                }

                const isOnline = onlineUsers.has(otherUser._id);
                const isSelected = selectedUser?._id === otherUser._id;

                return (
                  <div
                    key={conv._id}
                    onClick={() => loadConversation(otherUser)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-amber-700 text-white' 
                        : 'hover:bg-amber-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <FaUser className={isSelected ? 'text-white' : 'text-gray-600'} />
                        </div>
                        {isOnline && (
                          <FaCircle className="absolute bottom-0 right-0 text-green-500 text-xs" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isSelected ? 'text-white' : ''}`}>
                          {otherUser.nombre}
                        </p>
                        <p className={`text-sm truncate ${
                          isSelected ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {conv.lastMessage?.contenido || 'Sin mensajes'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Área de chat */}
        <div className={`md:col-span-2 flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md overflow-hidden ${!selectedUser ? 'hidden md:flex' : ''}`}>
          {selectedUser ? (
            <>
              {/* Header del chat - Estilo WhatsApp */}
              <div className="bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-3 flex items-center space-x-3 border-b border-amber-200">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden text-amber-800 hover:text-amber-900"
                >
                  <FaArrowLeft />
                </button>
                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                  <FaUser className="text-amber-700 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{selectedUser.nombre}</p>
                  <p className="text-xs text-gray-500">
                    {onlineUsers.has(selectedUser._id) ? (
                      <span className="flex items-center">
                        En línea
                      </span>
                    ) : (
                      'Desconectado'
                    )}
                  </p>
                </div>
              </div>

              {/* Mensajes - Estilo WhatsApp con scroll */}
              <div 
                className="flex-1 overflow-y-auto px-4 py-2" 
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L30 60M0 30L60 30\' stroke=\'%23e5e7eb\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
                  backgroundColor: '#ece5dd',
                  minHeight: '0'
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay mensajes aún</p>
                    <p className="text-sm text-gray-400">Envía el primer mensaje</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    // Determinar si el mensaje es propio - TODAS las variantes posibles
                    let remitenteId;
                    if (typeof msg.remitente === 'string') {
                      remitenteId = msg.remitente;
                    } else if (msg.remitente && msg.remitente._id) {
                      remitenteId = msg.remitente._id;
                    } else {
                      remitenteId = null;
                    }
                    
                    const isOwnMessage = remitenteId === myUserId;
                    
                    return (
                      <div
                        key={msg._id || index}
                        className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-1`}
                      >
                        <div
                          className={`max-w-[65%] rounded-lg px-3 py-2 ${
                            isOwnMessage
                              ? 'bg-[#d9fdd3] text-gray-900'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          } shadow-sm`}
                        >
                          {!isOwnMessage && (
                            <p className="text-xs font-semibold text-amber-800 mb-1">
                              {msg.remitente?.nombre || selectedUser?.nombre}
                            </p>
                          )}
                          <p className="text-sm break-words whitespace-pre-wrap">{msg.contenido}</p>
                          <p className="text-[10px] text-right mt-1 text-amber-600">
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {isTyping && (
                  <div className="flex justify-start mb-1">
                    <div className="bg-amber-100 rounded-lg px-4 py-3 shadow-sm border border-amber-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensaje - Estilo WhatsApp */}
              <form onSubmit={handleSendMessage} className="flex gap-2 px-4 py-3 bg-gradient-to-r from-amber-100 to-amber-50">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleTyping}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 rounded-full border border-amber-300 bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FaUser className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>Selecciona una conversación para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
