# 📚 Documentación de Cambios - Proyecto BookShare

## 📋 Resumen General
Este documento detalla todos los cambios, mejoras y funcionalidades implementadas en el proyecto BookShare, una plataforma de intercambio de libros universitarios con chat en tiempo real.

---

## 🎨 1. REDISEÑO VISUAL Y TEMA DE BIBLIOTECA

### 1.1 Fondo de Biblioteca
**Archivo modificado:** `frontend/src/index.css`

**Cambios implementados:**
```css
body {
  background-image: url('./src/background/library-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

body::before {
  background: linear-gradient(135deg, rgba(139, 92, 62, 0.75), rgba(101, 67, 33, 0.85));
}
```

**Explicación:**
- Se agregó una imagen de fondo de biblioteca para crear ambiente académico
- Se aplicó un overlay (capa) degradado en tonos marrones/ámbar (75-85% opacidad)
- El fondo es fijo (`fixed`) para efecto parallax al hacer scroll
- Se creó carpeta `frontend/src/background/` para almacenar la imagen

### 1.2 Esquema de Colores Cálidos
**Cambios en:** `frontend/src/index.css`

**Paleta de colores implementada:**
- **Primario:** Tonos ámbar (#B45309, #D97706, #F59E0B)
- **Secundario:** Marrones oscuros (#78350F, #654321)
- **Acentos:** Verde para intercambios, amarillo para calificaciones

**Componentes actualizados:**
```css
.btn-primary {
  background: amber-700;
  hover: amber-600;
}

.card {
  background: linear-gradient(135deg, rgba(255, 248, 240, 0.95), rgba(255, 243, 224, 0.95));
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: 0 8px 32px rgba(101, 67, 33, 0.3);
}

.input-field {
  background: amber-50;
  border: amber-300;
  focus: amber-600;
}
```

**Lógica:**
- Se reemplazaron todos los fondos blancos/grises por tonos ámbar cálidos
- Se agregó efecto de "vidrio esmerilado" (`backdrop-filter: blur(10px)`) en cards
- Los títulos ahora tienen sombra blanca para mejor legibilidad

---

## 💬 2. SISTEMA DE CHAT EN TIEMPO REAL

### 2.1 Backend - Socket.io
**Archivos modificados:**
- `backend/server.js`
- `backend/controllers/chatController.js`

**Instalación de dependencias:**
```bash
npm install socket.io@4.6.0
```

**Implementación en server.js:**
```javascript
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Map para usuarios conectados
const connectedUsers = new Map();

io.on('connection', (socket) => {
  // Evento: Usuario se conecta
  socket.on('user-connected', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('user-status-change', { userId, status: 'online' });
  });

  // Evento: Enviar mensaje
  socket.on('send-message', (messageData) => {
    const recipientSocketId = connectedUsers.get(messageData.destinatario);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive-message', messageData);
    }
  });

  // Evento: Usuario escribiendo
  socket.on('typing', ({ senderId, receiverId }) => {
    const recipientSocketId = connectedUsers.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user-typing', { userId: senderId });
    }
  });

  // Evento: Desconexión
  socket.on('disconnect', () => {
    // Limpiar usuario del Map
  });
});
```

**Lógica:**
1. **WebSocket bidireccional:** Conexión persistente entre cliente y servidor
2. **Map de usuarios:** Almacena `userId` → `socketId` para enrutamiento de mensajes
3. **Eventos en tiempo real:**
   - `user-connected`: Registra usuario online
   - `send-message`: Envía mensaje al destinatario específico
   - `typing`: Notifica que el usuario está escribiendo
   - `user-status-change`: Broadcast de cambios de estado

### 2.2 Frontend - Hook useSocket
**Archivo creado:** `frontend/src/hooks/useSocket.js`

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (user) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL);
      
      newSocket.on('connect', () => {
        newSocket.emit('user-connected', user._id || user.id);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return socket;
};
```

**Lógica:**
- Hook personalizado para gestionar conexión Socket.io
- Se conecta automáticamente cuando hay usuario autenticado
- Limpia conexión al desmontar componente

### 2.3 Componente Chat
**Archivo modificado:** `frontend/src/pages/Chat.jsx`

**Funcionalidades implementadas:**

#### A) Estructura de 3 columnas
```jsx
<div className="grid md:grid-cols-3 gap-4">
  {/* Columna 1: Lista de conversaciones */}
  <div className="card">...</div>
  
  {/* Columna 2-3: Área de chat */}
  <div className="md:col-span-2">...</div>
</div>
```

#### B) Gestión de mensajes en tiempo real
```javascript
// Recibir mensajes
useEffect(() => {
  if (socket) {
    socket.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
  }
}, [socket]);

// Enviar mensaje
const handleSendMessage = async (e) => {
  e.preventDefault();
  const messageData = {
    destinatario: selectedUser._id,
    contenido: messageInput,
    remitente: user._id
  };
  
  // Guardar en BD
  await chatService.sendMessage(messageData);
  
  // Enviar por WebSocket
  socket.emit('send-message', messageData);
  
  setMessageInput('');
};
```

#### C) Indicador de "escribiendo..."
```javascript
const [isTyping, setIsTyping] = useState(false);

const handleTyping = (e) => {
  setMessageInput(e.target.value);
  
  if (socket && selectedUser) {
    socket.emit('typing', {
      senderId: myUserId,
      receiverId: selectedUser._id
    });
  }
};

// Escuchar evento typing
socket.on('user-typing', ({ userId }) => {
  if (userId === selectedUser._id) {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  }
});
```

#### D) Estilo WhatsApp
```jsx
// Mensajes propios (derecha, verde)
<div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
  <div className={`max-w-[65%] rounded-lg px-3 py-2 ${
    isOwnMessage 
      ? 'bg-[#d9fdd3] text-gray-900'  // Verde WhatsApp
      : 'bg-amber-100 text-amber-900'  // Ámbar para recibidos
  }`}>
    <p>{msg.contenido}</p>
    <p className="text-[10px]">{formatTime(msg.createdAt)}</p>
  </div>
</div>
```

**Lógica de mensajes propios:**
```javascript
const myUserId = user?.id || user?._id; // Manejar ambos formatos
const isOwnMessage = msg.remitente._id === myUserId;
```

### 2.4 Sistema de Conversaciones
**Archivo:** `backend/controllers/chatController.js`

**Función getConversations:**
```javascript
export const getConversations = async (req, res) => {
  const userId = req.user._id;
  
  const conversations = await Message.aggregate([
    // 1. Filtrar mensajes del usuario (enviados o recibidos)
    {
      $match: {
        $and: [
          {
            $or: [
              { remitente: userId },
              { destinatario: userId }
            ]
          },
          // Excluir mensajes a sí mismo
          {
            $expr: { $ne: ['$remitente', '$destinatario'] }
          }
        ]
      }
    },
    // 2. Ordenar por fecha descendente
    { $sort: { createdAt: -1 } },
    // 3. Agrupar por "otro usuario"
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
    // 4. JOIN con colección users (remitente)
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.remitente',
        foreignField: '_id',
        as: 'remitenteInfo'
      }
    },
    // 5. JOIN con colección users (destinatario)
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.destinatario',
        foreignField: '_id',
        as: 'destinatarioInfo'
      }
    },
    // 6. Mapear datos de usuario
    {
      $addFields: {
        'lastMessage.remitente': {
          $arrayElemAt: ['$remitenteInfo', 0]
        },
        'lastMessage.destinatario': {
          $arrayElemAt: ['$destinatarioInfo', 0]
        }
      }
    }
  ]);
};
```

**Lógica del aggregate pipeline:**
1. Filtra mensajes donde el usuario es remitente O destinatario
2. Excluye mensajes enviados a sí mismo (`$ne: ['$remitente', '$destinatario']`)
3. Ordena por fecha para obtener el más reciente
4. Agrupa por "otro usuario" usando `$cond`
5. Hace JOIN ($lookup) con tabla users para poblar remitente y destinatario
6. Proyecta solo campos necesarios

---

## 🔧 3. CORRECCIONES DE BUGS

### 3.1 Problema de ID de Usuario
**Archivos afectados:**
- `frontend/src/pages/Chat.jsx`
- `frontend/src/pages/BookDetail.jsx`

**Problema:**
El backend devolvía `{ id: user._id }` en login, pero `{ _id: user._id }` en getProfile, causando inconsistencias.

**Solución:**
```javascript
// Antes
const isOwner = user.id === book.propietario._id; // ❌ undefined === ObjectId

// Después
const currentUserId = user?.id || user?._id; // ✅ Maneja ambos formatos
const isOwner = currentUserId === book.propietario._id;
```

**Aplicado en:**
- Comparación de mensajes propios en Chat
- Validación de propietario en BookDetail
- Carga de conversaciones

### 3.2 Populate en Aggregate
**Archivo:** `backend/controllers/chatController.js`

**Problema:**
```javascript
// ❌ No funciona
const messages = await Message.aggregate([...]);
await Message.populate(messages, { path: 'remitente destinatario' });
```

**Solución:**
Usar `$lookup` dentro del pipeline de agregación (ver sección 2.4)

### 3.3 Prevención de Auto-mensajes
**Validaciones agregadas:**

**Backend:**
```javascript
// chatController.js
export const sendMessage = async (req, res) => {
  if (req.user.id === destinatarioId) {
    return res.status(400).json({ 
      message: 'No puedes enviarte mensajes a ti mismo' 
    });
  }
  // ...
};
```

**Frontend:**
```javascript
// Chat.jsx
if (!otherUser || otherUser._id === myUserId) {
  return null; // No renderizar conversación consigo mismo
}
```

**Aggregate:**
```javascript
{
  $expr: { $ne: ['$remitente', '$destinatario'] }
}
```

---

## 🎯 4. MEJORAS DE INTERFAZ

### 4.1 Navbar con Menú Desplegable
**Archivo:** `frontend/src/components/Navbar.jsx`

**Antes:**
- Links directos a Perfil y Salir

**Después:**
```jsx
<div className="relative">
  <button onClick={() => setShowUserMenu(!showUserMenu)}>
    <FaUser />
    <span>{user?.nombre}</span>
    <FaChevronDown className={showUserMenu ? 'rotate-180' : ''} />
  </button>
  
  {showUserMenu && (
    <>
      <div className="fixed inset-0" onClick={() => setShowUserMenu(false)}></div>
      <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl">
        <Link to="/profile">Mi Perfil</Link>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    </>
  )}
</div>
```

**Características:**
- Estado local con `useState(false)`
- Overlay invisible para cerrar al hacer clic fuera
- Animación de flecha con `rotate-180`
- Separadores visuales entre opciones
- Iconos y colores diferenciados

**Separadores visuales:**
```jsx
<div className="h-6 w-px bg-amber-600"></div>
```
- Líneas verticales entre cada link de navegación
- Color ámbar coordinado con el tema

### 4.2 Página de Perfil Rediseñada
**Archivo:** `frontend/src/pages/Profile.jsx`

**Componentes agregados:**

#### A) Header con Avatar
```jsx
<div className="bg-gradient-to-r from-amber-100 to-orange-100">
  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
    {user.nombre.charAt(0).toUpperCase()}
  </div>
  <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full">
    <FaUserCircle />
  </div>
</div>
```

#### B) Cards de Información
```jsx
<div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200">
  <div className="flex items-center gap-3">
    <div className="bg-amber-500 p-3 rounded-lg">
      <FaUniversity className="text-white text-2xl" />
    </div>
    <h3>Universidad</h3>
  </div>
  <p>{user.universidad}</p>
</div>
```

**Iconos utilizados:**
- 🏛️ `FaUniversity` - Universidad (ámbar)
- 🎓 `FaGraduationCap` - Carrera (morado)
- 📞 `FaPhone` - Teléfono (verde)
- ⭐ `FaStar` - Calificación (amarillo)
- 🔄 `FaExchangeAlt` - Intercambios (verde)

**Efectos visuales:**
- Gradientes suaves en cada card
- Bordes de colores coordinados
- Sombras que se expanden al hover: `hover:shadow-lg`
- Iconos circulares con fondo de color

### 4.3 Detalle de Libro
**Archivo:** `frontend/src/pages/BookDetail.jsx`

**Campos informativos rediseñados:**
```jsx
<div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
  <FaGraduationCap className="text-2xl text-amber-700" />
  <div>
    <span className="text-sm text-amber-600">Materia</span>
    <p className="font-semibold text-amber-900">{book.materia}</p>
  </div>
</div>
```

**Iconos implementados:**
- 📖 `FaGraduationCap` - Materia
- 📊 `FaBarcode` - ISBN
- 🏢 `FaBuilding` - Editorial
- ✅ `FaCheckCircle` - Estado
- 🤝 `FaHandshake` - Tipo de oferta
- 📄 `FaFileAlt` - Descripción

**Modal de solicitud:**
```jsx
<div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300">
  <h2 className="text-amber-900">Solicitar {book.tipoOferta}</h2>
  {/* Formulario */}
</div>
```

### 4.4 Botones de Acción en Mis Libros
**Archivo:** `frontend/src/pages/MyBooks.jsx`

**Antes:**
```jsx
<button onClick={handleDelete}>Eliminar</button>
```

**Después:**
```jsx
<div className="flex gap-2">
  <Link to={`/books/${book._id}`} className="flex-1 bg-blue-500 hover:bg-blue-600">
    <FaEye />
    Ver
  </Link>
  <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 hover:scale-105">
    <FaTrashAlt />
    Eliminar
  </button>
</div>
```

**Efectos:**
- Iconos React Icons
- Transiciones suaves: `transition-all duration-200`
- Escala al hover: `transform hover:scale-105`
- Sombras: `hover:shadow-lg`

### 4.5 Títulos con Sombra Blanca
**Archivos:** Todos los archivos de páginas

**CSS aplicado:**
```css
h1, h2, h3, h4, h5, h6 {
  color: #78350F; /* amber-950 */
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
}
```

**Implementación inline:**
```jsx
<h1 className="text-4xl font-bold text-amber-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
  Libros Disponibles
</h1>
```

**Lógica:**
- Sombra blanca para crear contraste sobre el fondo oscuro
- Efecto de "resplandor" que hace los títulos más legibles
- Color ámbar muy oscuro para máximo contraste

---

## 📂 5. ESTRUCTURA DE CARPETAS

### Backend
```
backend/
├── controllers/
│   ├── authController.js      (✏️ Modificado: cambio "contraseña" → "password")
│   ├── chatController.js      (✏️ Modificado: getConversations con $lookup)
│   └── ...
├── models/
│   └── Message.js             (✅ Ya existía)
├── routes/
│   └── chatRoutes.js          (✅ Ya existía)
└── server.js                  (✏️ Modificado: Socket.io implementado)
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx         (✏️ Modificado: menú desplegable + separadores)
│   ├── hooks/
│   │   └── useSocket.js       (✏️ Modificado: useState en lugar de useRef)
│   ├── pages/
│   │   ├── BookDetail.jsx     (✏️ Modificado: iconos + colores ámbar)
│   │   ├── BookList.jsx       (✏️ Modificado: títulos con sombra)
│   │   ├── Chat.jsx           (✏️ Modificado: WhatsApp style + real-time)
│   │   ├── MyBooks.jsx        (✏️ Modificado: botones Ver/Eliminar)
│   │   └── Profile.jsx        (✏️ Modificado: rediseño completo)
│   ├── services/
│   │   └── chatService.js     (✅ Ya existía)
│   ├── background/
│   │   └── library-bg.jpg     (🆕 Nueva carpeta y archivo)
│   └── index.css              (✏️ Modificado: tema ámbar + utilidades)
└── package.json               (✏️ Modificado: socket.io-client agregado)
```

---

## 📦 6. DEPENDENCIAS AGREGADAS

### Backend
```json
{
  "socket.io": "^4.6.0"
}
```

### Frontend
```json
{
  "socket.io-client": "^4.6.0"
}
```

**Instalación:**
```bash
# Backend
cd backend
npm install socket.io@4.6.0

# Frontend
cd frontend
npm install socket.io-client@4.6.0
```

---

## 🔄 7. FLUJO DE DATOS

### 7.1 Flujo de Mensajes en Tiempo Real
```
Usuario A escribe mensaje
    ↓
Frontend Chat.jsx
    ↓
1. Guarda en BD (HTTP POST /api/chat/send)
    ↓
2. Emite evento WebSocket: socket.emit('send-message', data)
    ↓
Backend server.js
    ↓
Busca socketId de Usuario B en connectedUsers Map
    ↓
Emite a Usuario B: io.to(socketId).emit('receive-message', data)
    ↓
Frontend Usuario B
    ↓
Escucha evento: socket.on('receive-message')
    ↓
Actualiza estado: setMessages([...messages, newMessage])
    ↓
React re-renderiza con nuevo mensaje
```

### 7.2 Flujo de Conversaciones
```
Usuario entra a /chat
    ↓
useEffect en Chat.jsx
    ↓
fetchConversations()
    ↓
HTTP GET /api/chat/conversations
    ↓
Backend: chatController.getConversations()
    ↓
MongoDB Aggregate Pipeline:
  1. $match (mensajes del usuario)
  2. $sort (orden por fecha)
  3. $group (agrupar por conversación)
  4. $lookup (JOIN con users para remitente)
  5. $lookup (JOIN con users para destinatario)
  6. $addFields (reemplazar ObjectIds con objetos)
    ↓
Retorna array de conversaciones con usuarios poblados
    ↓
Frontend actualiza: setConversations(data.conversations)
    ↓
Renderiza lista en sidebar
```

### 7.3 Flujo de Estado Online/Offline
```
Usuario inicia sesión
    ↓
useSocket hook se ejecuta
    ↓
socket.connect()
    ↓
Emite: socket.emit('user-connected', userId)
    ↓
Backend: connectedUsers.set(userId, socketId)
    ↓
Broadcast: io.emit('user-status-change', { userId, status: 'online' })
    ↓
Todos los clientes reciben evento
    ↓
Actualizan Set: onlineUsers.add(userId)
    ↓
Re-renderiza indicador verde en conversaciones
```

---

## 🧪 8. VALIDACIONES Y SEGURIDAD

### 8.1 Validación de Auto-mensajes
**Lugares implementados:**
1. Backend API: `chatController.sendMessage()`
2. Backend Aggregate: `$expr: { $ne: ['$remitente', '$destinatario'] }`
3. Frontend Chat: filtrado en renderizado de conversaciones
4. Frontend BookDetail: oculta botón "Enviar Mensaje" si `isOwner`

### 8.2 Validación de Propietario
```javascript
// BookDetail.jsx
const currentUserId = user?.id || user?._id;
const isOwner = currentUserId === book.propietario?._id;

{!isOwner && book.disponible && (
  <button>Solicitar</button>
  <button>Enviar Mensaje</button>
)}

{isOwner && (
  <p>Este es tu libro</p>
)}
```

### 8.3 Manejo de Desconexión
```javascript
// server.js
socket.on('disconnect', () => {
  for (let [userId, socketId] of connectedUsers.entries()) {
    if (socketId === socket.id) {
      connectedUsers.delete(userId);
      io.emit('user-status-change', { userId, status: 'offline' });
      break;
    }
  }
});
```

---

## 🎨 9. UTILIDADES CSS AGREGADAS

### 9.1 Variables de Color
```css
/* Ámbar */
amber-50: #FFFBEB
amber-100: #FEF3C7
amber-200: #FDE68A
amber-300: #FCD34D
amber-600: #D97706
amber-700: #B45309
amber-800: #92400E
amber-900: #78350F
amber-950: #451A03

/* Naranja */
orange-50: #FFF7ED
orange-100: #FFEDD5
```

### 9.2 Clases Personalizadas
```css
/* Scrollbar personalizado */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Animaciones de delay */
.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}
```

---

## 🚀 10. COMANDOS PARA EJECUTAR

### Desarrollo
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

### Puertos
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- WebSocket: `ws://localhost:5000`

### Variables de Entorno
```env
# backend/.env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=tu_secreto

# frontend/.env
VITE_API_URL=http://localhost:5000
```

---

## 📊 11. MÉTRICAS DEL PROYECTO

### Archivos Modificados
- **Backend:** 3 archivos (server.js, chatController.js, authController.js)
- **Frontend:** 8 archivos (Chat.jsx, Navbar.jsx, Profile.jsx, BookDetail.jsx, MyBooks.jsx, BookList.jsx, useSocket.js, index.css)

### Líneas de Código Agregadas
- **Backend:** ~200 líneas (Socket.io + aggregate)
- **Frontend:** ~500 líneas (UI + WebSocket)
- **CSS:** ~100 líneas (tema + utilidades)

### Funcionalidades Nuevas
1. ✅ Chat en tiempo real con WebSocket
2. ✅ Sistema de conversaciones con MongoDB Aggregate
3. ✅ Indicador de "escribiendo..."
4. ✅ Estado online/offline de usuarios
5. ✅ Menú desplegable en navbar
6. ✅ Tema visual de biblioteca
7. ✅ Rediseño completo de perfil
8. ✅ Prevención de auto-mensajes
9. ✅ Iconos en toda la aplicación
10. ✅ Sistema de notificaciones visuales

---

## 🎓 12. CONCEPTOS TÉCNICOS IMPORTANTES

### WebSocket vs HTTP
- **HTTP:** Solicitud-Respuesta (request-response)
- **WebSocket:** Comunicación bidireccional persistente
- **Ventaja:** Mensajes instantáneos sin polling

### MongoDB Aggregate Pipeline
- **$match:** Filtra documentos
- **$group:** Agrupa por campo
- **$lookup:** JOIN con otra colección
- **$addFields:** Agrega/modifica campos
- **Ventaja:** Procesamiento en base de datos (más eficiente)

### React Hooks Utilizados
- `useState`: Estado local (mensajes, usuarios, menú)
- `useEffect`: Efectos secundarios (socket, API calls)
- `useContext`: Autenticación global (AuthContext)
- `useNavigate`: Navegación programática
- Hook personalizado `useSocket`: Reutilizable

### Tailwind CSS
- **Utility-first:** Clases atómicas
- **Responsive:** Prefijos `md:`, `lg:`
- **Hover:** `hover:bg-amber-600`
- **Transiciones:** `transition-colors duration-200`

---

## 📝 13. NOTAS PARA EXPOSICIÓN

### Puntos Clave a Mencionar:

1. **Problema Resuelto:**
   - Necesidad de comunicación instantánea entre usuarios
   - Intercambio de libros universitarios requiere coordinación rápida

2. **Tecnologías Elegidas:**
   - Socket.io: Biblioteca madura, compatible, fácil de implementar
   - MongoDB Aggregate: Optimización de consultas complejas
   - React Hooks: Código limpio y reutilizable

3. **Arquitectura:**
   - Separación Frontend/Backend
   - Comunicación híbrida: HTTP (datos) + WebSocket (tiempo real)
   - Autenticación con JWT

4. **Desafíos Superados:**
   - Sincronización de IDs (user.id vs user._id)
   - Populate en aggregates (solución con $lookup)
   - Prevención de auto-mensajes
   - Gestión de desconexiones

5. **Mejoras de UX:**
   - Tema visual coherente (biblioteca)
   - Feedback visual (typing, online/offline)
   - Interfaz intuitiva inspirada en WhatsApp
   - Responsive design

6. **Escalabilidad:**
   - WebSocket Room para chat grupal (futuro)
   - Redis para gestión de sesiones (producción)
   - CDN para imágenes (optimización)

---

## 🔮 14. POSIBLES MEJORAS FUTURAS

1. **Notificaciones Push** con Service Workers
2. **Carga de imágenes** en mensajes
3. **Mensajes de voz** con MediaRecorder API
4. **Chat grupal** con rooms de Socket.io
5. **Búsqueda en conversaciones**
6. **Marcar mensajes como leídos** (checkmarks dobles)
7. **Encriptación end-to-end**
8. **Videollamadas** con WebRTC
9. **Stickers/Emojis personalizados**
10. **Tema oscuro/claro** configurable

---

---

## 📧 15. SISTEMA DE VERIFICACIÓN DE EMAIL

### 15.1 Migración de Gmail a SendGrid
**Problema:** Gmail requiere configuración personal de cada desarrollador y tiene limitaciones de seguridad.

**Solución:** Implementación de SendGrid como servicio profesional de emails.

### 15.2 Backend - Configuración de Email
**Archivo modificado:** `backend/config/email.js`

**Migración completa:**
```javascript
// ANTES: Nodemailer con Gmail
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// DESPUÉS: SendGrid con API Key
import sgMail from '@sendgrid/mail';

const transporter = {
  sendMail: async (mailOptions) => {
    const msg = {
      to: mailOptions.to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: mailOptions.subject,
      html: mailOptions.html,
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: false }
      }
    };
    const response = await sgMail.send(msg);
    return { messageId: response[0].headers['x-message-id'] };
  }
};
```

**Características implementadas:**
1. **Inicialización lazy:** El transporter se inicializa solo cuando se usa
2. **Modo de desarrollo:** Si no hay credenciales, simula emails en consola
3. **Tracking deshabilitado:** Evita que SendGrid modifique URLs de verificación
4. **Tokens Base64URL:** Más cortos que hex (43 vs 64 caracteres)

### 15.3 Modelo de Usuario
**Archivo modificado:** `backend/models/User.js`

**Campos agregados:**
```javascript
{
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date
}
```

### 15.4 Controlador de Autenticación
**Archivo modificado:** `backend/controllers/authController.js`

#### A) Registro con Verificación
```javascript
export const register = async (req, res) => {
  // Generar token de verificación (Base64 URL-safe)
  const verificationToken = crypto.randomBytes(32).toString('base64url');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    nombre, email, password,
    verificationToken,
    verificationTokenExpires,
    isVerified: false
  });

  // Enviar email de verificación
  await sendVerificationEmail(user.email, verificationToken, user.nombre);

  res.status(201).json({
    success: true,
    message: 'Usuario registrado. Por favor verifica tu correo.',
    token, // JWT para mantener sesión temporalmente
    user: { ...user, isVerified: false }
  });
};
```

**Lógica:**
- Token expira en 24 horas
- Usuario se crea con `isVerified: false`
- Email se envía de forma asíncrona (no bloquea registro)
- Se devuelve JWT pero el login bloqueará acceso hasta verificación

#### B) Login con Bloqueo
```javascript
export const login = async (req, res) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email o contraseña incorrectos. Si no tienes cuenta, regístrate.'
    });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Email o contraseña incorrectos'
    });
  }

  // Bloquear login si no está verificado
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Por favor verifica tu correo antes de iniciar sesión',
      needsVerification: true,
      email: user.email
    });
  }

  // Login exitoso
  const token = generateToken(user._id);
  res.json({ success: true, token, user });
};
```

**Códigos HTTP:**
- `401 Unauthorized`: Credenciales incorrectas
- `403 Forbidden`: Email no verificado
- `200 OK`: Login exitoso

#### C) Verificación de Email
```javascript
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Token de verificación inválido o expirado'
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  // Enviar email de bienvenida
  await sendWelcomeEmail(user.email, user.nombre);

  res.json({
    success: true,
    message: '¡Email verificado exitosamente! Tu cuenta está activa.'
  });
};
```

**Flujo:**
1. Busca usuario con token válido y no expirado
2. Marca `isVerified = true`
3. Elimina token y fecha de expiración
4. Envía email de bienvenida
5. Usuario puede hacer login

#### D) Reenvío de Verificación
```javascript
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'Este email ya está verificado'
    });
  }

  // Generar nuevo token
  const verificationToken = crypto.randomBytes(32).toString('base64url');
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  await sendVerificationEmail(user.email, verificationToken, user.nombre);

  res.json({
    success: true,
    message: 'Email de verificación reenviado exitosamente'
  });
};
```

### 15.5 Servicio de Email
**Archivo:** `backend/services/emailService.js`

#### A) Email de Verificación
```javascript
export const sendVerificationEmail = async (email, token, userName) => {
  await verifyEmailConfig();
  const transporter = getTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"BookShare - Verificación" <${process.env.SENDGRID_FROM_EMAIL}>`,
    to: email,
    subject: '✅ Verifica tu cuenta en BookShare',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #B45309, #D97706); 
                        color: white; padding: 30px; text-align: center;">
              <div style="font-size: 48px;">📚</div>
              <h1>¡Bienvenido a BookShare!</h1>
            </div>
            
            <div style="padding: 30px; background-color: #FFF7ED;">
              <h2 style="color: #B45309;">Hola ${userName},</h2>
              <p>Para completar tu registro, verifica tu email:</p>
              
              <!-- Botón con tabla (compatible con todos los clientes) -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #D97706; border-radius: 8px;">
                          <a href="${verificationUrl}" 
                             style="display: inline-block; padding: 15px 40px; 
                                    color: #ffffff; text-decoration: none; 
                                    font-weight: bold;">
                            Verificar mi cuenta
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin-top: 20px;">Si el botón no funciona, copia este enlace:</p>
              <span style="background-color: #FEF3C7; padding: 10px; 
                           display: block; border-radius: 4px; word-break: break-all;">
                ${verificationUrl}
              </span>
              
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                <strong>Nota:</strong> Este enlace expira en 24 horas.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
```

**Características del template:**
- ✅ Diseño responsivo (max-width: 600px)
- ✅ Gradiente ámbar en header
- ✅ Botón con tabla HTML (máxima compatibilidad)
- ✅ URL de respaldo en recuadro amarillo
- ✅ Estilos inline (no CSS externo)

#### B) Email de Bienvenida
```javascript
export const sendWelcomeEmail = async (email, userName) => {
  const mailOptions = {
    from: `"BookShare" <${process.env.SENDGRID_FROM_EMAIL}>`,
    to: email,
    subject: '🎉 ¡Cuenta verificada exitosamente!',
    html: `
      <div style="background: linear-gradient(135deg, #059669, #10B981); 
                  color: white; padding: 30px;">
        <div style="font-size: 48px;">✅</div>
        <h1>¡Cuenta Verificada!</h1>
      </div>
      <div style="padding: 30px;">
        <h2>Hola ${userName},</h2>
        <p>Tu cuenta ha sido verificada exitosamente.</p>
        <p>Ya puedes iniciar sesión y comenzar a intercambiar libros.</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};
```

### 15.6 Frontend - Páginas de Verificación

#### A) VerifyEmail.jsx
**Archivo creado:** `frontend/src/pages/VerifyEmail.jsx`

```javascript
const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Limpiar token de sesión no verificada
    localStorage.removeItem('token');
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/verify-email/${token}`
      );
      
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Error al verificar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'loading' && (
        <FaSpinner className="animate-spin text-6xl text-amber-600" />
      )}
      
      {status === 'success' && (
        <>
          <FaCheckCircle className="text-6xl text-green-600 animate-bounce" />
          <h2>¡Email Verificado!</h2>
          <p>Redirigiendo al inicio de sesión...</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <FaTimesCircle className="text-6xl text-red-600" />
          <h2>Error de Verificación</h2>
          <Link to="/resend-verification">Reenviar email</Link>
        </>
      )}
    </div>
  );
};
```

**Estados:**
- `loading`: Spinner animado
- `success`: Check verde + redirección automática
- `error`: X roja + link para reenviar

#### B) ResendVerification.jsx
**Archivo creado:** `frontend/src/pages/ResendVerification.jsx`

```javascript
const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/auth/resend-verification', { email });
      toast.success('Email de verificación reenviado. Revisa tu bandeja.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al reenviar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        required
      />
      <button disabled={loading}>
        {loading ? 'Enviando...' : 'Reenviar Email'}
      </button>
    </form>
  );
};
```

#### C) Login.jsx - Advertencia de Verificación
**Modificaciones:**

```javascript
const Login = () => {
  const [showVerificationWarning, setShowVerificationWarning] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/books');
    } catch (error) {
      const errorData = error.response?.data;
      
      // Mostrar banner si necesita verificación
      if (errorData?.needsVerification) {
        setShowVerificationWarning(true);
        setUnverifiedEmail(errorData.email);
        toast.error(errorData.message);
      } else {
        toast.error(errorData?.message || 'Error al iniciar sesión');
      }
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      await axios.post('/api/auth/resend-verification', {
        email: unverifiedEmail
      });
      toast.success('Email reenviado. Revisa tu bandeja.');
    } catch (error) {
      toast.error('Error al reenviar email');
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <>
      {/* Banner de advertencia */}
      {showVerificationWarning && (
        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-amber-600 text-xl" />
            <div>
              <h3 className="font-bold text-amber-900">Email no verificado</h3>
              <p className="text-sm">
                Revisa tu bandeja en <strong>{unverifiedEmail}</strong>
              </p>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="bg-amber-600 text-white px-4 py-2 rounded mt-2"
              >
                <FaEnvelope /> Reenviar Email de Verificación
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Formulario de login */}
      <form onSubmit={handleSubmit}>
        {/* ... */}
      </form>
    </>
  );
};
```

#### D) Register.jsx - Banner Informativo
```javascript
const Register = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('¡Registro exitoso! Revisa tu correo para verificar.');
      navigate('/login'); // Ya no redirige a /books
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      {/* Banner informativo */}
      <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg mb-4">
        <div className="flex gap-3">
          <FaInfoCircle className="text-blue-600 text-xl" />
          <div>
            <h3 className="font-bold text-blue-900">Verificación de Email</h3>
            <p className="text-sm text-blue-800">
              Después de registrarte, recibirás un email de verificación.
              Debes verificar tu cuenta antes de poder iniciar sesión.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* ... */}
      </form>
    </>
  );
};
```

### 15.7 AuthContext - Manejo de Tokens
**Archivo modificado:** `frontend/src/context/AuthContext.jsx`

```javascript
const register = async (userData) => {
  const data = await authService.register(userData);
  
  // NO guardar token si el usuario no está verificado
  if (data.user && data.user.isVerified) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  } else {
    // Usuario registrado pero no verificado
    console.log('Usuario debe verificar email antes de continuar');
  }
  
  return data;
};
```

**Lógica:**
- Si `isVerified: false` → No guardar token en localStorage
- Evita que usuarios no verificados accedan a la app
- Fuerza verificación antes del primer login

### 15.8 Variables de Entorno
**Archivos modificados:**

#### backend/.env
```env
# Configuración de Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=morapalmatyrone@gmail.com

# Frontend URL (para enlaces de verificación)
FRONTEND_URL=http://localhost:5173
```

#### backend/.env.example
```env
# SendGrid (OPCIONAL - modo desarrollo si está vacío)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# Para obtener API Key:
# 1. Crear cuenta en https://sendgrid.com (100 emails/día gratis)
# 2. Settings > API Keys > Create API Key
# 3. Permisos: "Mail Send"
# 4. SENDGRID_FROM_EMAIL debe estar verificado en SendGrid
```

### 15.9 Rutas de API
**Archivo:** `backend/routes/authRoutes.js`

```javascript
// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Rutas protegidas
router.get('/profile', authenticateToken, getProfile);
router.delete('/delete-account', authenticateToken, deleteAccount);
```

### 15.10 Configuración de SendGrid

#### A) Crear Cuenta
1. Ir a https://sendgrid.com
2. Registrarse (100 emails/día gratis)
3. Verificar email de SendGrid

#### B) Obtener API Key
1. **Settings** > **API Keys**
2. **Create API Key**
3. Nombre: "BookShare"
4. Permisos: **"Mail Send"** (Full Access opcional)
5. Copiar API Key (solo se muestra una vez)

#### C) Verificar Email Remitente
1. **Settings** > **Sender Authentication**
2. **Single Sender Verification** > **Create New Sender**
3. Completar formulario:
   - From Name: `BookShare`
   - From Email: `morapalmatyrone@gmail.com`
   - Reply To: mismo email
   - Company: `BookShare`
   - Address, City, etc.
4. **Submit**
5. Verificar email que SendGrid envía
6. Esperar mensaje "Verified" ✅

#### D) Deshabilitar Tracking (Importante)
1. **Settings** > **Tracking**
2. **Click Tracking** → OFF
3. **Open Tracking** → OFF

**Razón:** El tracking de clicks reescribe las URLs, truncando los tokens de verificación largos.

### 15.11 Modo de Desarrollo

**Si NO se configuran credenciales de SendGrid:**

```javascript
// backend/config/email.js
const isDevelopmentMode = !process.env.SENDGRID_API_KEY || 
                          !process.env.SENDGRID_FROM_EMAIL;

if (isDevelopmentMode) {
  console.log('📧 Modo de desarrollo: Los emails se simularán');
  
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📨 [SIMULADO] Email que se enviaría:');
      console.log('   Para:', mailOptions.to);
      console.log('   Asunto:', mailOptions.subject);
      console.log('   💡 Configura SENDGRID_API_KEY para enviar emails reales');
      return { messageId: 'dev-message-id' };
    }
  };
}
```

**Ventajas:**
- ✅ El servidor funciona sin configuración
- ✅ Los usuarios pueden registrarse
- ✅ Los emails aparecen en consola del backend
- ✅ Ideal para testing y desarrollo

### 15.12 Flujo Completo de Verificación

```
Usuario se registra
    ↓
Backend genera token Base64URL
    ↓
Guarda usuario con isVerified=false
    ↓
Envía email con SendGrid
    ↓
Usuario recibe email
    ↓
Click en botón "Verificar mi cuenta"
    ↓
GET /api/auth/verify-email/zkCzxqxEZuTXvMt...
    ↓
Backend busca usuario con token válido
    ↓
Marca isVerified=true
    ↓
Envía email de bienvenida
    ↓
Frontend muestra check verde
    ↓
Redirección a /login después de 3 segundos
    ↓
Usuario puede hacer login
```

### 15.13 Seguridad Implementada

#### A) Tokens Seguros
```javascript
// 32 bytes aleatorios = 256 bits de entropía
const verificationToken = crypto.randomBytes(32).toString('base64url');
// Resultado: "zkCzxqxEZuTXvMt81bV46TV51gIWtgCxmRiJhTOOBUI"
```

#### B) Expiración de Tokens
```javascript
verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
// 24 horas desde la creación
```

#### C) Validación en Login
```javascript
if (!user.isVerified) {
  return res.status(403).json({
    message: 'Por favor verifica tu correo antes de iniciar sesión'
  });
}
```

#### D) Limpieza de Tokens
```javascript
// Después de verificar
user.verificationToken = undefined;
user.verificationTokenExpires = undefined;
await user.save();
```

### 15.14 Manejo de Errores

#### A) Token Inválido/Expirado
```javascript
const user = await User.findOne({
  verificationToken: token,
  verificationTokenExpires: { $gt: Date.now() }
});

if (!user) {
  // Debug adicional
  const userWithoutExpiry = await User.findOne({ verificationToken: token });
  if (userWithoutExpiry) {
    console.log('Token expiró el:', userWithoutExpiry.verificationTokenExpires);
  } else {
    console.log('No existe usuario con ese token');
  }
  
  return res.status(400).json({
    success: false,
    message: 'Token de verificación inválido o expirado'
  });
}
```

#### B) Email No Verificado en SendGrid
```javascript
// SendGrid error response
{
  "errors": [{
    "message": "The from address does not match a verified Sender Identity",
    "field": "from"
  }]
}
```

**Solución:** Verificar email en SendGrid (Settings > Sender Authentication)

#### C) Tracking Truncando URLs
**Problema:** SendGrid reescribe URLs para tracking, truncando tokens largos.

**Solución:**
```javascript
trackingSettings: {
  clickTracking: { enable: false },
  openTracking: { enable: false }
}
```

### 15.15 Documentación para Desarrolladores

**Archivo creado:** `backend/CONFIGURACION_SENDGRID.md`

Contiene:
- ✅ Paso a paso para crear cuenta SendGrid
- ✅ Cómo obtener API Key
- ✅ Verificación de email remitente
- ✅ Configuración del .env
- ✅ Troubleshooting común
- ✅ Comparación Gmail vs SendGrid
- ✅ Modo de desarrollo explicado

### 15.16 Dependencias Instaladas

```json
{
  "dependencies": {
    "@sendgrid/mail": "^7.7.0"
  }
}
```

**Desinstaladas:**
```json
{
  "nodemailer": "^6.9.0" // ❌ Removido
}
```

### 15.17 Mejoras de UX

#### A) Feedback Visual
- ⏳ Spinner mientras verifica
- ✅ Check verde animado (bounce) al verificar
- ❌ X roja si falla
- 🔄 Contador de redirección (3 segundos)

#### B) Mensajes Claros
- ✅ "Email o contraseña incorrectos. Si no tienes cuenta, regístrate."
- ✅ "Por favor verifica tu correo antes de iniciar sesión"
- ✅ "Token de verificación inválido o expirado"
- ✅ "¡Email verificado exitosamente! Tu cuenta está activa."

#### C) Accesibilidad
- Iconos descriptivos (FaCheckCircle, FaTimesCircle)
- Colores semánticos (verde=éxito, rojo=error, amarillo=advertencia)
- Enlaces de respaldo en emails

---

**Autor:** Sistema de Chat BookShare  
**Fecha:** 7 de noviembre de 2025  
**Versión del Proyecto:** 2.1.0  
**Stack:** MERN + Socket.io + TailwindCSS + SendGrid
