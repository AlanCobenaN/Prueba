# BookShare - Sistema de Intercambio de Libros entre Estudiantes

> **Proyecto 3 - Actividad Práctica: Integración de Kanban y Extreme Programming (XP)**  
> **Materia:** Modelado Ágil de Software  
> **Docente:** Ing. Israel Julio Gomez, Mg.

BookShare es una plataforma web que permite a estudiantes universitarios intercambiar o prestar libros de texto que ya no necesitan, fomentando el ahorro y la sostenibilidad dentro de la comunidad estudiantil.

## 📌 Problema a Resolver

Los estudiantes compran libros caros que solo usan un semestre y luego quedan sin uso. BookShare facilita el intercambio y préstamo entre estudiantes, reduciendo costos y promoviendo la economía circular.

## 🎯 Metodologías Ágiles Aplicadas

### 📊 Kanban
- **Tablero:** Backlog → Por Hacer → En Desarrollo → En Revisión → Testing → Hecho
- **Límites WIP:** Máximo 2 tareas en "En Desarrollo" y 2 en "Testing"
- **Daily Standup:** 10 minutos al inicio de cada sesión
- **Herramienta:** Miro
- **Link del tablero:** [Ver tablero Kanban en Miro](https://miro.com/app/board/uXjVJzSrykY=/?share_link_id=446418032994)

### 🔧 Extreme Programming (XP)

#### Prácticas Implementadas:

1. **Pair Programming** 
   - Todo el código se escribe en parejas
   - Rotación de parejas cada sesión
   - Documentación de sesiones en commits

2. **Test-Driven Development (TDD)**
   - Ciclo Red-Green-Refactor
   - Cobertura mínima: 80%
   - Tests antes del código

3. **Integración Continua**
   - Commits diarios al repositorio
   - GitHub Actions configurado
   - Build automático en cada push

4. **Refactorización Continua**
   - Mejora constante del código
   - Sin cambiar funcionalidad
   - Documentada en commits

5. **Estándares de Código**
   - Convenciones definidas por el equipo
   - ESLint/Prettier configurados
   - Revisión en pull requests

6. **Propiedad Colectiva**
   - Todo el equipo responsable del código
   - No hay "dueños" de módulos
   - Conocimiento compartido

## 🚀 Características Principales

- **Gestión de Usuarios**: Registro e inicio de sesión con perfil estudiantil
- **Catálogo de Libros**: Publicación y búsqueda de libros por título, autor o materia
- **Sistema de Intercambios**: Solicitud y gestión de intercambios o préstamos
- **Calificaciones**: Sistema de reseñas para evaluar experiencias de intercambio
- **Chat en Tiempo Real**: Comunicación instantánea entre usuarios con Socket.io ✅

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express**: Framework del servidor
- **MongoDB** + **Mongoose**: Base de datos NoSQL
- **JWT**: Autenticación y autorización
- **Socket.io**: Comunicación en tiempo real
- **Multer**: Gestión de archivos/imágenes

### Frontend
- **React 18**: Biblioteca de interfaz de usuario
- **Vite**: Herramienta de construcción rápida
- **TailwindCSS**: Framework de estilos
- **React Router**: Navegación
- **Axios**: Cliente HTTP

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **MongoDB** (v5 o superior) - Instalado y ejecutándose
- **npm** o **yarn**

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
cd Proyecto_BookShare
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

#### Configurar MongoDB Atlas (Cloud Database)

1. **Crear cuenta en MongoDB Atlas:**
   - Ir a https://www.mongodb.com/cloud/atlas
   - Crear cuenta gratuita (Free Tier)

2. **Crear un Cluster:**
   - Seleccionar plan gratuito (M0)
   - Elegir región más cercana
   - Crear cluster (toma 3-5 minutos)

3. **Configurar Acceso:**
   - **Database Access:** Crear usuario con contraseña
     - Username: `[tu_usuario]`
     - Password: `[contraseña_segura]`
     - Rol: "Atlas admin" o "Read and write to any database"
   
   - **Network Access:** Añadir IP address
     - Para desarrollo: `0.0.0.0/0` (permite todas las IPs)
     - Para producción: solo tu IP específica

4. **Obtener Connection String:**
   - Click en "Connect" → "Connect your application"
   - Copiar el string: `mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`

5. **Configurar archivo `.env`:**

Copiar el archivo de ejemplo:

```bash
copy .env.example .env
```

Editar `.env` con tu conexión de MongoDB Atlas:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
# Reemplazar <username>, <password> y añadir el nombre de base de datos
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.xxxxx.mongodb.net/bookshare?retryWrites=true&w=majority&appName=BookShare

# JWT Secret (cambiar por algo único y seguro)
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiar

# Configuración de archivos
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# Configuración de Email (SendGrid) - OPCIONAL
# Si NO configuras estas variables, el sistema funcionará en modo desarrollo
# (los emails se simularán en la consola del servidor)
# Ver backend/CONFIGURACION_SENDGRID.md para instrucciones detalladas
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
```

**⚠️ IMPORTANTE:**
- Reemplazar `TU_USUARIO` con tu usuario de MongoDB Atlas
- Reemplazar `TU_PASSWORD` con tu contraseña (codificar caracteres especiales si los hay)
- Si la contraseña tiene `@` → usar `%40`, `#` → `%23`, etc.
- **NO subir el archivo `.env` a Git** (ya está en `.gitignore`)

**📧 Configuración de Email (OPCIONAL):**
- El sistema de verificación de email funciona sin configuración en **modo desarrollo**
- Para enviar emails reales, configura SendGrid (gratis, 100 emails/día)
- Ver **[backend/CONFIGURACION_SENDGRID.md](backend/CONFIGURACION_SENDGRID.md)** para instrucciones completas

#### Alternativa: MongoDB Local

Si prefieres usar MongoDB localmente:

```env
MONGODB_URI=mongodb://localhost:27017/bookshare
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Opcionalmente, crear archivo `.env` en la carpeta frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Ejecutar la Aplicación

### Verificar Conexión a MongoDB

El backend se conectará automáticamente a MongoDB Atlas al iniciar. Verás un mensaje de confirmación:

```
MongoDB conectado: ac-xxxxxxx-shard-00-01.xxxxx.mongodb.net
```

### Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Iniciar el Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
Proyecto_BookShare/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   ├── controllers/              # Lógica de negocio
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── exchangeController.js
│   │   ├── reviewController.js
│   │   ├── chatController.js
│   │   └── userController.js
│   ├── middleware/               # Middlewares personalizados
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/                   # Modelos de datos
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Exchange.js
│   │   ├── Review.js
│   │   └── Message.js
│   ├── routes/                   # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── exchangeRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── chatRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/                  # Archivos subidos
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Punto de entrada
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/           # Componentes reutilizables
    │   │   ├── BookCard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── SearchBar.jsx
    │   ├── context/              # Context API
    │   │   └── AuthContext.jsx
    │   ├── pages/                # Páginas principales
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── BookList.jsx
    │   │   ├── BookDetail.jsx
    │   │   ├── CreateBook.jsx
    │   │   ├── MyBooks.jsx
    │   │   ├── Exchanges.jsx
    │   │   ├── Profile.jsx
    │   │   └── Chat.jsx
    │   ├── services/             # Servicios API
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── bookService.js
    │   │   └── exchangeService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## 🔑 API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Libros
- `GET /api/books` - Listar todos los libros
- `GET /api/books/:id` - Obtener libro por ID
- `POST /api/books` - Publicar libro (requiere auth)
- `PUT /api/books/:id` - Actualizar libro (requiere auth)
- `DELETE /api/books/:id` - Eliminar libro (requiere auth)
- `GET /api/books/my-books` - Mis libros (requiere auth)

### Intercambios
- `POST /api/exchanges` - Crear solicitud (requiere auth)
- `GET /api/exchanges/received` - Solicitudes recibidas (requiere auth)
- `GET /api/exchanges/sent` - Solicitudes enviadas (requiere auth)
- `PUT /api/exchanges/:id/status` - Actualizar estado (requiere auth)
- `PUT /api/exchanges/:id/complete` - Completar intercambio (requiere auth)

### Reseñas
- `POST /api/reviews` - Crear reseña (requiere auth)
- `GET /api/reviews/user/:userId` - Reseñas de un usuario

## 📝 Convenciones de Código

### JavaScript / Node.js
- Usar `camelCase` para variables y funciones
- Usar `PascalCase` para clases y componentes
- Usar `const` y `let` (no `var`)
- Indentación de 2 espacios
- Comentarios breves y descriptivos

### React
- Un componente por archivo
- Nombre del archivo = Nombre del componente
- Evitar lógica compleja dentro del JSX
- Usar TailwindCSS para estilos

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Entregables de la Actividad Práctica

### 1. Repositorio Git ✅
- [x] Branches para features principales
- [x] Commits diarios con mensajes descriptivos
- [x] Historial claro de refactorizaciones
- [ ] Pull requests con revisión de código

### 2. Suite de Tests
- [ ] Tests unitarios (backend)
- [ ] Tests de integración
- [ ] Cobertura mínima: 80%
- [ ] Tests para funcionalidades críticas:
  - [ ] Sistema de autenticación
  - [ ] Búsqueda de libros
  - [ ] Solicitudes de intercambio
  - [ ] Calificaciones

### 3. Tablero Kanban
- [ ] Configurado en [Herramienta elegida]
- [ ] Screenshots semanales
- [ ] Análisis de bloqueos identificados
- [ ] Métricas: Lead Time y Cycle Time
- [ ] Retrospectivas documentadas

### 4. Aplicación Web Funcional ✅
- [x] Backend con MongoDB Atlas
- [x] Frontend con React + Vite
- [ ] Todas las funcionalidades requeridas implementadas
- [ ] Base de datos poblada con datos de prueba

### 5. Presentación (10 minutos)
- [ ] Explicación de arquitectura del sistema
- [ ] Demo en vivo de funcionalidades
- [ ] Ejemplos de pair programming
- [ ] Decisiones técnicas tomadas

### 6. Documentación
- [x] README completo con setup
- [x] Configuración de MongoDB Atlas
- [ ] Documento de decisiones técnicas
- [ ] Manual de estándares de código
- [ ] Retrospectiva final

### 7. Video/Demo
- [ ] Video de 5 minutos mostrando funcionalidades
- [ ] Capturas de pantalla de flujos principales

## 📋 Checklist de Funcionalidades Requeridas

### Autenticación y Usuarios
- [ ] Registro de usuarios con perfil estudiantil
- [ ] Login/Logout
- [ ] Perfil de usuario editable

### Gestión de Libros
- [ ] Publicación de libros (título, autor, materia, estado, foto)
- [ ] Búsqueda por título
- [ ] Búsqueda por materia
- [ ] Búsqueda por autor
- [ ] Visualización de detalles del libro

### Sistema de Intercambios
- [ ] Solicitud de intercambio
- [ ] Solicitud de préstamo
- [ ] Aceptar/Rechazar solicitudes
- [ ] Estados: Pendiente, Aceptado, Rechazado, Completado, Cancelado

### Calificaciones y Reseñas
- [ ] Calificar intercambios realizados (1-5 estrellas)
- [ ] Comentarios sobre intercambios
- [ ] Visualización de calificación promedio del usuario

### Chat Simple
- [ ] Envío de mensajes entre usuarios
- [ ] Notificación de mensajes nuevos
- [ ] Historial de conversaciones

## 🎯 Prácticas XP Aplicadas en el Proyecto

### Pair Programming
**Evidencia requerida:**
- Commits con co-autores
- Log de sesiones de pair programming
- Rotación de parejas documentada

**Módulos desarrollados en parejas:**
- [ ] Sistema de búsqueda de libros
- [ ] Funcionalidad de chat
- [ ] Gestión de intercambios
- [ ] Sistema de calificaciones

### TDD (Test-Driven Development)
**Módulos con TDD:**
- [ ] Algoritmo de matching de libros
- [ ] Lógica de gestión de usuarios
- [ ] Validaciones de intercambios
- [ ] Cálculo de calificaciones

**Ciclo Red-Green-Refactor documentado en:**
- [ ] Tests de búsqueda
- [ ] Tests de autenticación
- [ ] Tests de intercambios

### Integración Continua
- [ ] GitHub Actions configurado
- [ ] Tests automáticos en cada push
- [ ] Build automático
- [ ] Reporte de cobertura de tests

### Refactorización
**Refactorizaciones realizadas:**
- [ ] Código de gestión de usuarios
- [ ] Componentes del frontend
- [ ] Controladores del backend
- [ ] Modelos de datos

## 📊 Métricas del Proyecto

### Kanban Metrics
- **Throughput:** [Tareas completadas por semana]
- **Lead Time:** [Tiempo promedio desde Backlog hasta Hecho]
- **Cycle Time:** [Tiempo promedio desde En Desarrollo hasta Hecho]
- **WIP Limits Violations:** [Veces que se excedió el límite]

### Código
- **Cobertura de Tests:** [%]
- **Bugs Encontrados:** [Número]
- **Bugs Resueltos:** [Número]
- **Commits Totales:** [Número]
- **Pull Requests:** [Número]

### Velocity
- **Semana 1:** [Tareas completadas]
- **Semana 2:** [Tareas completadas]
- **Semana 3:** [Tareas completadas]

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es un prototipo educativo.

## 👥 Autor

Proyecto BookShare - Sistema de Intercambio de Libros

## 🔮 Próximas Características

- [ ] Chat en tiempo real completamente funcional
- [ ] Sistema de notificaciones
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Mapa de ubicación para coordinar entregas
- [ ] Sistema de reportes
- [ ] Panel de administración
- [ ] Aplicación móvil

---

¡Gracias por usar BookShare! 📚✨

---

## 📊 Estado Actual del Proyecto

### ✅ Completado

- [x] Configuración de MongoDB Atlas
- [x] Backend con Express y Mongoose
- [x] Frontend con React + Vite + TailwindCSS
- [x] Autenticación JWT funcional
- [x] Estructura del proyecto definida
- [x] Documentación de metodologías ágiles
- [x] Guías de contribución y estándares
- [x] Templates para retrospectivas y pair programming

### 🚧 En Progreso

- [ ] Implementación de funcionalidades core
- [ ] Suite de tests (TDD)
- [ ] Tablero Kanban en uso
- [ ] Sesiones de pair programming
- [ ] Integración continua (CI/CD)

### 📋 Próximos Pasos

1. ✅ **Tablero Kanban en Miro configurado** - https://miro.com/app/board/uXjVJzSrykY=/
2. **Iniciar desarrollo** con pair programming
3. **Implementar TDD** para módulos core
4. **Daily standups** de 10 minutos
5. **Exportar tablero Miro** semanalmente para documentación

### 📚 Documentación Disponible

- [`README.md`](README.md) - Documentación principal del proyecto
- [`CONTRIBUTING.md`](CONTRIBUTING.md) - Guía de contribución y estándares de código
- [`docs/pair-programming-log.md`](docs/pair-programming-log.md) - Registro de sesiones de pair programming
- [`docs/retrospectivas.md`](docs/retrospectivas.md) - Retrospectivas semanales (Start-Stop-Continue)
- [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md) - Decisiones de arquitectura y diseño
- [`docs/ENTREGABLES-CHECKLIST.md`](docs/ENTREGABLES-CHECKLIST.md) - Checklist completo de entregables

**Tablero Kanban en Miro:** https://miro.com/app/board/uXjVJzSrykY=/

### 🎓 Equipo

| # | Nombre | Rol Principal | Roles Secundarios |
|---|--------|---------------|-------------------|
| 1 | Robinson Moreira | Líder / Coordinador | Comunicación con cliente y planificación de iteraciones |
| 2 | Joseph Mora | Desarrollador A | Soporte en integración y pruebas unitarias |
| 3 | Jonny Castillo | Desarrollador B | Refactorización, control de versiones y revisión de código |
| 4 | Néstor Ayala | Tester / QA | Asegura cumplimiento de historias y criterios de aceptación |
| 5 | Alan Cobeña | Analista / Representante del cliente | Define requisitos, historias de usuario y prioridades |

**Nota:** Los roles se mantienen durante el proyecto con responsabilidades específicas según las prácticas XP.

---

**Proyecto desarrollado como parte de la actividad práctica de Modelado Ágil de Software**
