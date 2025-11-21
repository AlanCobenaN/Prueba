# Decisiones Técnicas - BookShare

## 📋 Registro de Decisiones de Arquitectura y Diseño

Este documento registra las decisiones técnicas importantes tomadas durante el desarrollo del proyecto BookShare.

---

## Decisión 1: Stack Tecnológico

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos elegir el stack tecnológico para desarrollar la aplicación de intercambio de libros.

**Decisión:**
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB Atlas (NoSQL)
- **Frontend:** React 18 + Vite
- **Estilos:** TailwindCSS
- **Autenticación:** JWT

**Razones:**
1. **Node.js/Express:** 
   - Facilita desarrollo rápido
   - Ecosistema npm extenso
   - Curva de aprendizaje accesible
   - JavaScript en frontend y backend (mismo lenguaje)

2. **MongoDB Atlas:**
   - NoSQL flexible para iteraciones rápidas
   - Esquemas pueden evolucionar fácilmente
   - Free tier suficiente para desarrollo
   - Integración sencilla con Mongoose

3. **React + Vite:**
   - React es ampliamente usado y tiene gran comunidad
   - Vite ofrece hot reload muy rápido
   - Excelente experiencia de desarrollo

4. **TailwindCSS:**
   - Desarrollo UI rápido sin escribir CSS custom
   - Diseño responsive out-of-the-box
   - Consistencia en estilos

**Alternativas consideradas:**
- PostgreSQL (SQL) - Descartado por mayor rigidez en esquemas
- Vue.js - Descartado por menor familiaridad del equipo
- CSS Modules - Descartado por mayor tiempo de desarrollo

**Consecuencias:**
- ✅ Desarrollo ágil y rápido
- ✅ Misma sintaxis en frontend/backend
- ⚠️ NoSQL requiere validaciones cuidadosas

---

## Decisión 2: Arquitectura del Backend

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos definir la estructura y organización del código del backend.

**Decisión:**
Adoptar arquitectura **MVC (Model-View-Controller)** adaptada para APIs REST.

**Estructura:**
```
backend/
├── config/         # Configuraciones (DB, etc.)
├── controllers/    # Lógica de negocio
├── middleware/     # Auth, validaciones, error handling
├── models/         # Esquemas de Mongoose
├── routes/         # Definición de endpoints
└── server.js       # Punto de entrada
```

**Razones:**
1. Separación clara de responsabilidades
2. Fácil de testear (módulos independientes)
3. Escalable y mantenible
4. Patrón familiar para el equipo

**Consecuencias:**
- ✅ Código organizado y mantenible
- ✅ Facilita pair programming (módulos claros)
- ✅ Tests más sencillos

---

## Decisión 3: Autenticación con JWT

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos un sistema de autenticación para proteger rutas y recursos.

**Decisión:**
Usar **JSON Web Tokens (JWT)** almacenados en localStorage del frontend.

**Implementación:**
- Login genera token JWT con expiración de 7 días
- Token incluye: userId, email, rol
- Middleware `authenticateToken` valida en cada petición protegida
- Frontend envía token en header `Authorization: Bearer <token>`

**Razones:**
1. Stateless - servidor no mantiene sesiones
2. Escalable - no requiere almacenamiento en servidor
3. Estándar de la industria
4. Sencillo de implementar

**Alternativas consideradas:**
- Sessions con cookies - Descartado por complejidad en arquitectura REST
- OAuth - Sobredimensionado para este proyecto

**Consecuencias:**
- ✅ Autenticación robusta
- ⚠️ localStorage vulnerable a XSS (mitigado con validaciones)
- ⚠️ Tokens no pueden ser revocados fácilmente (usar expiración corta)

---

## Decisión 4: Mongoose para ODM

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos interactuar con MongoDB de forma estructurada.

**Decisión:**
Usar **Mongoose** como ODM (Object Document Mapper).

**Razones:**
1. Define esquemas y validaciones
2. Middleware hooks (pre-save, post-find)
3. Population para relaciones entre documentos
4. Validación automática de datos

**Implementación:**
```javascript
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ...
});
```

**Consecuencias:**
- ✅ Validaciones en capa de datos
- ✅ Código más limpio y mantenible
- ⚠️ Abstracción adicional (curva de aprendizaje)

---

## Decisión 5: Subida de Imágenes con Multer

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Los usuarios deben poder subir fotos de libros.

**Decisión:**
- Usar **Multer** para manejo de archivos
- Almacenar imágenes en carpeta `uploads/` local
- Servir imágenes como archivos estáticos

**Configuración:**
- Tamaño máximo: 5MB
- Formatos permitidos: JPG, PNG, JPEG
- Nombres únicos: timestamp + nombre original

**Razones:**
1. Multer es estándar en Node.js
2. Almacenamiento local es sencillo para MVP
3. No requiere servicios externos (S3, Cloudinary)

**Alternativas consideradas:**
- AWS S3 - Descartado por complejidad y costos
- Cloudinary - Descartado para simplificar desarrollo inicial

**Consecuencias:**
- ✅ Implementación rápida
- ⚠️ No escalable a largo plazo (migrar a cloud storage en producción)
- ⚠️ Backups manuales necesarios

**Plan futuro:**
Migrar a Cloudinary o S3 antes de deployment en producción.

---

## Decisión 6: React Context para Estado Global

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos compartir estado de autenticación entre componentes.

**Decisión:**
Usar **Context API de React** para manejar autenticación global.

**Implementación:**
```javascript
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // ...
};
```

**Razones:**
1. Solución nativa de React (no dependencias extra)
2. Suficiente para estado de autenticación
3. Fácil de entender y mantener

**Alternativas consideradas:**
- Redux - Sobredimensionado para este proyecto
- Zustand - Innecesario para solo autenticación

**Consecuencias:**
- ✅ Código simple y mantenible
- ✅ No añade dependencias
- ⚠️ Puede causar re-renders innecesarios (mitigado con useMemo)

---

## Decisión 7: TailwindCSS con Configuración Custom

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos estilos consistentes y desarrollo rápido de UI.

**Decisión:**
Usar **TailwindCSS** con `tailwind.config.js` personalizado.

**Configuración:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        // ...
      }
    }
  }
}
```

**Razones:**
1. Desarrollo UI muy rápido
2. Diseño responsive automático
3. Clases utilitarias predefinidas
4. Purge elimina CSS no usado

**Consecuencias:**
- ✅ Velocidad de desarrollo UI
- ✅ Consistencia visual
- ⚠️ HTML con muchas clases (menos legible)

---

## Decisión 8: Validaciones Dobles (Frontend + Backend)

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos validar datos de formularios y API requests.

**Decisión:**
Implementar validaciones **tanto en frontend como en backend**.

**Frontend:**
- Validación en tiempo real en formularios
- Feedback inmediato al usuario
- Previene requests innecesarios

**Backend:**
- Validación con `express-validator`
- Validación de Mongoose schemas
- Seguridad (frontend puede ser bypasseado)

**Razones:**
1. UX mejorada (frontend)
2. Seguridad robusta (backend)
3. Previene datos inválidos en BD

**Consecuencias:**
- ✅ Experiencia de usuario excelente
- ✅ Datos siempre válidos
- ⚠️ Código duplicado (trade-off aceptable)

---

## Decisión 9: Socket.io para Chat en Tiempo Real

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos funcionalidad de chat entre usuarios.

**Decisión:**
Usar **Socket.io** para mensajería en tiempo real.

**Implementación:**
```javascript
// Server
io.on('connection', (socket) => {
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
  });
  
  socket.on('send-message', (data) => {
    io.to(data.chatId).emit('receive-message', data);
  });
});
```

**Razones:**
1. Estándar para WebSockets en Node.js
2. Fácil integración con Express
3. Soporte de rooms (chats individuales)
4. Fallback a polling si WebSocket no disponible

**Alternativas consideradas:**
- WebSockets nativos - Más complejo de implementar
- Long polling - Menos eficiente

**Consecuencias:**
- ✅ Chat en tiempo real funcional
- ✅ Escalable para múltiples chats
- ⚠️ Requiere persistencia de mensajes en BD (implementado)

---

## Decisión 10: Estrategia de Branches Git

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos workflow de Git para colaboración del equipo.

**Decisión:**
Adoptar **Git Flow simplificado**:

```
main (producción)
  └── develop (integración)
       ├── feature/nombre
       ├── bugfix/nombre
       └── refactor/nombre
```

**Reglas:**
1. No push directo a `main`
2. Features desde `develop`
3. Pull requests obligatorios
4. Review antes de merge
5. Delete branch después de merge

**Razones:**
1. Separación clara entre desarrollo y producción
2. Code reviews aseguran calidad
3. Historial limpio y organizado
4. Facilita pair programming

**Consecuencias:**
- ✅ Código revisado antes de merge
- ✅ Historial Git limpio
- ✅ Fomenta colaboración
- ⚠️ Requiere disciplina del equipo

---

## Decisión 11: Estructura de Modelos de Datos

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos definir esquemas de MongoDB para entidades principales.

**Decisión:**
5 modelos principales con referencias:

1. **User**: Información de estudiantes
2. **Book**: Libros publicados
3. **Exchange**: Solicitudes de intercambio/préstamo
4. **Review**: Calificaciones de intercambios
5. **Message**: Mensajes de chat

**Relaciones:**
- Book → User (propietario)
- Exchange → User (solicitante y propietario)
- Exchange → Book (libro solicitado y ofrecido)
- Review → Exchange, User (evaluador y evaluado)
- Message → User (remitente y destinatario)

**Razones:**
1. Normalización adecuada
2. Queries eficientes con population
3. Integridad referencial
4. Escalable para nuevas features

**Consecuencias:**
- ✅ Datos bien estructurados
- ✅ Fácil agregar features
- ⚠️ Algunos queries requieren múltiples lookups (optimizable)

---

## Decisión 12: Error Handling Centralizado

**Fecha:** [DD/MM/YYYY]

**Contexto:**
Necesitamos manejo consistente de errores en toda la API.

**Decisión:**
Middleware de error handling centralizado:

```javascript
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

**Razones:**
1. Respuestas de error consistentes
2. Fácil debugging en desarrollo
3. Seguridad en producción (no exponer stack traces)
4. DRY (Don't Repeat Yourself)

**Consecuencias:**
- ✅ API con respuestas consistentes
- ✅ Debugging más sencillo
- ✅ Código más limpio

---

## Decisiones Pendientes

### 1. Deployment
**Opciones evaluando:**
- Heroku (backend)
- Vercel (frontend)
- Railway (full stack)
- Render (full stack)

**Decisión:** [Pendiente - Semana 3]

### 2. CI/CD
**Opciones:**
- GitHub Actions
- GitLab CI

**Decisión:** [Pendiente - Semana 2]

---

## Lecciones Aprendidas

### Lo que funcionó bien:
1. [Decisión técnica exitosa]
2. [Razón del éxito]

### Lo que cambiaríamos:
1. [Decisión que requirió ajustes]
2. [Qué haríamos diferente]

---

**Última actualización:** [Fecha]
**Responsables:** [Nombres del equipo]
