# Sistema de Chat en Tiempo Real - BookShare

## 📱 Descripción

Sistema de mensajería instantánea implementado con Socket.io que permite a los usuarios comunicarse en tiempo real para coordinar intercambios de libros.

## ✨ Características

### Funcionalidades Principales

1. **Chat en Tiempo Real**
   - Mensajes instantáneos sin recargar la página
   - Historial de conversaciones persistente en base de datos
   - Scroll automático a nuevos mensajes

2. **Indicadores de Estado**
   - Estado en línea/desconectado de usuarios
   - Indicador de "escribiendo..." cuando el otro usuario está tecleando
   - Notificaciones de nuevos mensajes

3. **Interfaz Intuitiva**
   - Lista de conversaciones con último mensaje
   - Vista dividida: conversaciones + chat activo
   - Diseño responsive para móvil y escritorio
   - Timestamps en cada mensaje

4. **Integración con el Sistema**
   - Acceso directo al chat desde detalles de libro
   - Botón de chat en solicitudes de intercambio
   - Conversaciones automáticas al hacer intercambios

## 🏗️ Arquitectura

### Backend (Socket.io Server)

**Archivo:** `backend/server.js`

```javascript
- Gestión de conexiones de usuarios
- Mapeo de userId -> socketId
- Salas de chat privadas
- Emisión de eventos en tiempo real
```

**Eventos Socket.io:**

| Evento | Descripción |
|--------|-------------|
| `user-connected` | Usuario se conecta al chat |
| `join-chat` | Usuario se une a una sala específica |
| `send-message` | Enviar mensaje a una sala |
| `receive-message` | Recibir mensaje en tiempo real |
| `typing` | Usuario está escribiendo |
| `stop-typing` | Usuario dejó de escribir |
| `user-status-change` | Cambio de estado (online/offline) |
| `new-message-notification` | Notificación de nuevo mensaje |

### Frontend (React + Socket.io Client)

**Hook personalizado:** `frontend/src/hooks/useSocket.js`
- Gestión de conexión socket
- Reconexión automática
- Cleanup al desmontar

**Página principal:** `frontend/src/pages/Chat.jsx`
- Lista de conversaciones
- Área de chat con mensajes
- Input con indicador de escritura
- Estado en línea de usuarios

**Servicio API:** `frontend/src/services/chatService.js`
- Obtener conversaciones
- Cargar historial de mensajes
- Guardar mensajes en base de datos

## 🔧 Configuración

### Requisitos Previos

- Backend corriendo en puerto 5000
- Frontend corriendo en puerto 5173
- MongoDB conectado

### Variables de Entorno

**Backend (.env):**
```env
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env - opcional):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Uso

### 1. Iniciar una Conversación

**Desde un Libro:**
```
1. Ir a los detalles de un libro
2. Hacer clic en "Enviar Mensaje"
3. Se abre el chat con el propietario
```

**Desde Intercambios:**
```
1. Ir a "Mis Intercambios"
2. Hacer clic en el botón "Chat" de cualquier intercambio
3. Se abre la conversación con el usuario
```

### 2. Enviar Mensajes

- Escribir en el campo de texto
- Presionar Enter o hacer clic en el botón de enviar
- El mensaje se guarda en la base de datos Y se envía por socket en tiempo real

### 3. Ver Estado de Usuarios

- Punto verde = Usuario en línea
- Sin punto = Usuario desconectado
- Texto "Escribiendo..." cuando el otro usuario está tecleando

## 📊 Flujo de Datos

### Envío de Mensaje

```
1. Usuario escribe mensaje → Frontend
2. Guardar en BD → API REST (chatService.sendMessage)
3. Mensaje guardado → Response con mensaje completo
4. Emitir evento → Socket.io ('send-message')
5. Servidor reenvía → Todos en la sala ('receive-message')
6. Actualizar UI → Agregar mensaje a la lista
```

### Indicador de Escritura

```
1. Usuario teclea → Evento 'keyup'
2. Emitir 'typing' → Socket a la sala
3. Otro usuario recibe → Mostrar "Escribiendo..."
4. Timeout 1s sin teclear → Emitir 'stop-typing'
5. Ocultar indicador → Actualizar UI
```

## 🎨 Componentes de UI

### Lista de Conversaciones
- Avatar del usuario
- Nombre del usuario
- Último mensaje enviado
- Indicador de estado (online/offline)
- Highlight de conversación seleccionada

### Área de Chat
- Header con información del usuario
- Lista de mensajes con scroll
- Mensajes propios (azul, derecha)
- Mensajes recibidos (gris, izquierda)
- Timestamps en cada mensaje
- Indicador "escribiendo..."

### Input de Mensaje
- Campo de texto
- Botón de envío
- Deshabilitado si está vacío

## 🔐 Seguridad

1. **Autenticación:** Solo usuarios autenticados pueden chatear
2. **Autorización:** Solo se pueden ver conversaciones propias
3. **Validación:** Mensajes validados antes de guardar
4. **Sanitización:** Contenido escapado para prevenir XSS

## 📱 Responsive Design

- **Desktop:** Vista dividida (lista + chat)
- **Tablet:** Vista dividida adaptable
- **Mobile:** Vista única, cambio entre lista y chat

## 🐛 Debugging

### Ver conexiones activas:
```javascript
// En consola del navegador
console.log('Socket conectado:', socket.connected);
console.log('Socket ID:', socket.id);
```

### Ver eventos emitidos:
```javascript
// Backend logs
console.log('Usuario conectado:', userId);
console.log('Mensaje enviado:', message);
```

### Errores Comunes

| Error | Solución |
|-------|----------|
| Socket no conecta | Verificar que backend esté corriendo |
| Mensajes no aparecen | Verificar que ambos usuarios estén en la misma sala |
| "Usuario escribiendo" no desaparece | Verificar timeout del evento 'stop-typing' |

## 🔄 Mejoras Futuras

- [ ] Envío de imágenes en chat
- [ ] Mensajes de voz
- [ ] Grupos de chat
- [ ] Búsqueda en historial
- [ ] Eliminar mensajes
- [ ] Editar mensajes
- [ ] Reacciones a mensajes
- [ ] Mensajes no leídos (badge con contador)
- [ ] Notificaciones push
- [ ] Encriptación end-to-end

## 📚 Recursos

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Hooks](https://react.dev/reference/react)
- [MongoDB Queries](https://www.mongodb.com/docs/manual/tutorial/query-documents/)

---

Sistema de Chat implementado completamente funcional ✅
