# Backend README

## Estructura del Backend

El backend está construido con Node.js, Express y MongoDB, siguiendo una arquitectura MVC (Model-View-Controller).

## Modelos de Datos

### User (Usuario)
- `nombre`: String (requerido)
- `email`: String (único, requerido)
- `password`: String (hasheado, requerido)
- `universidad`: String (requerido)
- `carrera`: String (requerido)
- `telefono`: String
- `avatar`: String
- `calificacion`: Number (0-5)
- `numeroIntercambios`: Number

### Book (Libro)
- `titulo`: String (requerido)
- `autor`: String (requerido)
- `materia`: String (requerido)
- `isbn`: String
- `editorial`: String
- `edicion`: String
- `estado`: Enum ['Nuevo', 'Como nuevo', 'Bueno', 'Aceptable', 'Desgastado']
- `descripcion`: String
- `foto`: String
- `propietario`: ObjectId (referencia a User)
- `disponible`: Boolean
- `tipoOferta`: Enum ['Intercambio', 'Préstamo', 'Ambos']

### Exchange (Intercambio)
- `solicitante`: ObjectId (referencia a User)
- `propietario`: ObjectId (referencia a User)
- `libro`: ObjectId (referencia a Book)
- `tipo`: Enum ['Intercambio', 'Préstamo']
- `libroOfrecido`: ObjectId (referencia a Book, opcional)
- `estado`: Enum ['Pendiente', 'Aceptado', 'Rechazado', 'Completado', 'Cancelado']
- `mensaje`: String
- `fechaEntrega`: Date
- `fechaDevolucion`: Date

### Review (Reseña)
- `intercambio`: ObjectId (referencia a Exchange)
- `evaluador`: ObjectId (referencia a User)
- `evaluado`: ObjectId (referencia a User)
- `calificacion`: Number (1-5, requerido)
- `comentario`: String (max 500 caracteres)

### Message (Mensaje)
- `remitente`: ObjectId (referencia a User)
- `destinatario`: ObjectId (referencia a User)
- `contenido`: String (requerido)
- `leido`: Boolean

## Middleware

### auth.js
- `authenticateToken`: Verifica el token JWT en las peticiones
- `generateToken`: Genera un nuevo token JWT

### upload.js
- Configuración de Multer para subida de imágenes
- Validación de tipos de archivo (solo imágenes)
- Límite de tamaño de archivo (5MB por defecto)

### errorHandler.js
- Manejo centralizado de errores
- Respuestas de error consistentes

## Scripts Disponibles

```bash
npm start          # Inicia el servidor en modo producción
npm run dev        # Inicia el servidor con nodemon (desarrollo)
npm test          # Ejecuta las pruebas
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bookshare
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

## Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación mediante JWT
- Validación de datos con express-validator
- CORS configurado
- Protección de rutas sensibles

## Desarrollo

1. Instalar dependencias: `npm install`
2. Configurar variables de entorno
3. Asegurarse de que MongoDB está ejecutándose
4. Ejecutar en modo desarrollo: `npm run dev`

## Pruebas

Para probar los endpoints, puedes usar:
- Postman
- Thunder Client (extensión de VS Code)
- curl

Ejemplo de registro:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456",
    "universidad": "Universidad Nacional",
    "carrera": "Ingeniería"
  }'
```
