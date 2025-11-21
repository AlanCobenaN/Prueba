# Frontend README

## Estructura del Frontend

El frontend está construido con React 18, Vite y TailwindCSS, siguiendo las mejores prácticas de desarrollo moderno.

## Componentes Principales

### Páginas (Pages)
- `Home`: Página de inicio con información del proyecto
- `Login`: Formulario de inicio de sesión
- `Register`: Formulario de registro de usuarios
- `BookList`: Lista de todos los libros disponibles
- `BookDetail`: Detalles de un libro específico
- `CreateBook`: Formulario para publicar un nuevo libro
- `MyBooks`: Lista de libros del usuario actual
- `Exchanges`: Gestión de intercambios (recibidos y enviados)
- `Profile`: Perfil del usuario
- `Chat`: Chat entre usuarios (próximamente)

### Componentes Reutilizables
- `Navbar`: Barra de navegación principal
- `BookCard`: Tarjeta de libro para listas
- `SearchBar`: Barra de búsqueda
- `PrivateRoute`: Componente de ruta protegida

## Contexto (Context API)

### AuthContext
Maneja el estado de autenticación global:
- `user`: Información del usuario actual
- `token`: Token de autenticación JWT
- `loading`: Estado de carga
- `login()`: Función para iniciar sesión
- `register()`: Función para registrarse
- `logout()`: Función para cerrar sesión
- `isAuthenticated`: Booleano de estado de autenticación

## Servicios (Services)

### api.js
Cliente Axios configurado con:
- Base URL del API
- Interceptores para agregar tokens
- Manejo automático de errores 401

### authService.js
- `register()`: Registro de usuarios
- `login()`: Inicio de sesión
- `getProfile()`: Obtener perfil del usuario

### bookService.js
- `getAllBooks()`: Obtener todos los libros
- `getBookById()`: Obtener libro por ID
- `getMyBooks()`: Obtener libros del usuario
- `createBook()`: Crear nuevo libro
- `updateBook()`: Actualizar libro
- `deleteBook()`: Eliminar libro

### exchangeService.js
- `createExchange()`: Crear solicitud de intercambio
- `getReceivedExchanges()`: Obtener solicitudes recibidas
- `getSentExchanges()`: Obtener solicitudes enviadas
- `updateExchangeStatus()`: Actualizar estado de intercambio
- `completeExchange()`: Completar intercambio

## Estilos con TailwindCSS

### Clases Personalizadas

```css
.btn-primary        /* Botón primario azul */
.btn-secondary      /* Botón secundario verde */
.btn-outline        /* Botón con borde */
.input-field        /* Campo de entrada estándar */
.card              /* Tarjeta con sombra y padding */
```

### Colores Personalizados
- `primary`: Azul (#3B82F6)
- `secondary`: Verde (#10B981)
- `accent`: Naranja (#F59E0B)
- `danger`: Rojo (#EF4444)

## Scripts Disponibles

```bash
npm run dev        # Inicia el servidor de desarrollo (http://localhost:5173)
npm run build      # Construye la aplicación para producción
npm run preview    # Previsualiza la build de producción
npm run lint       # Ejecuta el linter
```

## Estructura de Carpetas

```
src/
├── components/      # Componentes reutilizables
├── context/         # Context API (estado global)
├── pages/          # Páginas de la aplicación
├── services/       # Servicios para llamadas API
├── App.jsx         # Componente principal
├── main.jsx        # Punto de entrada
└── index.css       # Estilos globales
```

## Rutas de la Aplicación

- `/` - Home (pública)
- `/login` - Iniciar sesión (pública)
- `/register` - Registrarse (pública)
- `/books` - Lista de libros (privada)
- `/books/:id` - Detalle de libro (privada)
- `/create-book` - Publicar libro (privada)
- `/my-books` - Mis libros (privada)
- `/exchanges` - Mis intercambios (privada)
- `/profile` - Mi perfil (privada)
- `/chat` - Chat (privada, próximamente)

## Convenciones de Código

### Componentes React
- Usar componentes funcionales con Hooks
- Un componente por archivo
- Nombre del archivo = Nombre del componente (PascalCase)
- Exportación por defecto al final del archivo

### Estado y Efectos
```jsx
const [state, setState] = useState(initialValue);

useEffect(() => {
  // Lógica de efecto
}, [dependencies]);
```

### Manejo de Formularios
```jsx
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

## Desarrollo

1. Instalar dependencias: `npm install`
2. Configurar variables de entorno (opcional)
3. Ejecutar en modo desarrollo: `npm run dev`
4. Abrir navegador en `http://localhost:5173`

## Build para Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Notificaciones

Se utiliza `react-toastify` para las notificaciones:
```jsx
import { toast } from 'react-toastify';

toast.success('Operación exitosa');
toast.error('Error al realizar operación');
toast.info('Información importante');
toast.warning('Advertencia');
```

## Navegación

Se usa `react-router-dom` para la navegación:
```jsx
import { useNavigate, Link } from 'react-router-dom';

const navigate = useNavigate();
navigate('/ruta');

<Link to="/ruta">Enlace</Link>
```
