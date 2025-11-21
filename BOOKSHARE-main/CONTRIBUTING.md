# Guía de Contribución - BookShare

## 🎯 Metodología de Trabajo

Este proyecto sigue las metodologías **Kanban** y **Extreme Programming (XP)** como parte de la actividad práctica de Modelado Ágil de Software.

## 📊 Tablero Kanban

### Estructura del Tablero (Miro)

```
┌─────────────┬────────────┬──────────────┬─────────────┬─────────┬────────┐
│  Backlog    │ Por Hacer  │ En Desarrollo│ En Revisión │ Testing │ Hecho  │
└─────────────┴────────────┴──────────────┴─────────────┴─────────┴────────┘
```

**Link del tablero:** https://miro.com/app/board/uXjVJzSrykY=/

**Embed para documentación:**
```html
<iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVJzSrykY=/?embedMode=view_only_without_ui&moveToViewport=-1057,-829,2091,995&embedId=446418032994" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>
```

### Límites WIP (Work In Progress)

- **En Desarrollo:** Máximo 2 tareas
- **Testing:** Máximo 2 tareas
- ⚠️ **No empezar nueva tarea si se alcanzó el límite**

### Daily Standup (10 minutos)

Responder 3 preguntas:
1. ¿Qué hice ayer?
2. ¿Qué haré hoy?
3. ¿Tengo algún impedimento?

### Revisión Semanal

- Analizar métricas (Lead Time, Cycle Time)
- Identificar cuellos de botella
- Ajustar procesos si es necesario
- Documentar mejoras
- **Exportar tablero de Miro** para registro semanal

## 🔧 Prácticas XP

### 1. Pair Programming

#### Reglas
- **Todo el código se escribe en parejas**
- Rotar parejas cada sesión de trabajo
- Driver (escribe) y Navigator (revisa)
- Cambiar roles cada 25 minutos (Pomodoro)

#### Formato de Commits con Co-autores

```bash
git commit -m "feat: implementar búsqueda de libros

Co-authored-by: Nombre Apellido <email@example.com>"
```

#### Log de Sesiones

Documentar en `docs/pair-programming-log.md`:
- Fecha y hora
- Parejas
- Módulo trabajado
- Decisiones técnicas tomadas

### 2. Test-Driven Development (TDD)

#### Ciclo Red-Green-Refactor

1. 🔴 **Red:** Escribir test que falla
2. 🟢 **Green:** Escribir código mínimo para pasar el test
3. 🔵 **Refactor:** Mejorar el código sin romper tests

#### Ejemplo

```javascript
// 1. RED - Test que falla
test('debe buscar libros por título', () => {
  const resultado = buscarLibros('JavaScript');
  expect(resultado).toHaveLength(2);
});

// 2. GREEN - Implementación mínima
function buscarLibros(titulo) {
  return libros.filter(libro => 
    libro.titulo.includes(titulo)
  );
}

// 3. REFACTOR - Mejorar (case insensitive, trim, etc.)
function buscarLibros(titulo) {
  const busqueda = titulo.trim().toLowerCase();
  return libros.filter(libro => 
    libro.titulo.toLowerCase().includes(busqueda)
  );
}
```

#### Cobertura Mínima
- **Meta:** 80% de cobertura de código
- Verificar con: `npm test -- --coverage`

### 3. Integración Continua

#### Commits Frecuentes
- **Mínimo:** 2-3 commits por sesión de trabajo
- **Tamaño:** Pequeños y atómicos
- **Frecuencia:** Al menos 1 commit diario por desarrollador

#### GitHub Actions
- Tests automáticos en cada push
- Build automático
- Verificación de linting

### 4. Refactorización Continua

#### Cuándo Refactorizar
- Código duplicado
- Funciones muy largas (>20 líneas)
- Nombres poco descriptivos
- Complejidad excesiva

#### Cómo Refactorizar
1. Asegurarse de que hay tests
2. Hacer cambios pequeños
3. Ejecutar tests después de cada cambio
4. Commit con mensaje claro

```bash
git commit -m "refactor: simplificar lógica de validación de intercambios"
```

### 5. Estándares de Código

#### Convenciones de Nombres

**JavaScript/Node.js:**
```javascript
// Variables y funciones: camelCase
const userName = 'Juan';
function getUserById(id) { }

// Clases y componentes: PascalCase
class BookController { }
function BookCard() { }

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880;

// Archivos: kebab-case o PascalCase
// book-controller.js o BookController.js
```

**MongoDB/Mongoose:**
```javascript
// Modelos: PascalCase singular
const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);

// Colecciones: lowercase plural (automático)
// users, books, exchanges
```

#### Formato de Código
- **Indentación:** 2 espacios
- **Comillas:** Simples `'texto'` (JavaScript)
- **Punto y coma:** Usar siempre
- **Longitud de línea:** Máximo 80-100 caracteres

#### ESLint y Prettier
```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

### 6. Propiedad Colectiva del Código

#### Principios
- ✅ Cualquiera puede modificar cualquier parte del código
- ✅ No hay "dueños" de módulos específicos
- ✅ Todo el equipo es responsable de todo el código
- ✅ Compartir conocimiento constantemente

#### Prácticas
- Rotar entre backend y frontend
- Revisar PRs de otros miembros
- Documentar decisiones técnicas
- Pair programming rotativo

## 🌿 Estrategia de Ramas (Git Branching)

### Ramas Principales

```
main (producción)
  └── develop (desarrollo)
       ├── feature/nombre-funcionalidad
       ├── bugfix/nombre-bug
       └── refactor/nombre-refactor
```

### Nomenclatura de Ramas

**Features:**
```
feature/autenticacion-usuarios
feature/busqueda-libros
feature/chat-tiempo-real
```

**Bugfixes:**
```
bugfix/corregir-validacion-email
bugfix/error-subida-imagenes
```

**Refactors:**
```
refactor/controladores-backend
refactor/componentes-react
```

### Workflow de Desarrollo

1. **Crear rama desde `develop`**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcionalidad
```

2. **Desarrollar con commits frecuentes**
```bash
git add .
git commit -m "feat: agregar validación de email"
git push origin feature/nombre-funcionalidad
```

3. **Crear Pull Request**
- De `feature/nombre` → `develop`
- Asignar revisor
- Esperar aprobación
- Merge después de revisión

4. **Actualizar rama local**
```bash
git checkout develop
git pull origin develop
git branch -d feature/nombre-funcionalidad
```

## 📝 Formato de Commits

### Conventional Commits

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos de Commits

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `docs`: Cambios en documentación
- `style`: Formato de código (no afecta lógica)
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
feat(auth): implementar registro de usuarios
fix(books): corregir búsqueda por autor
refactor(exchange): simplificar lógica de estados
test(reviews): agregar tests para calificaciones
docs(readme): actualizar guía de instalación
```

## 🔍 Proceso de Code Review

### Checklist para el Autor

- [ ] El código sigue los estándares del equipo
- [ ] Hay tests para la nueva funcionalidad
- [ ] Todos los tests pasan
- [ ] No hay código comentado innecesario
- [ ] Variables y funciones tienen nombres descriptivos
- [ ] Se documentaron decisiones técnicas complejas

### Checklist para el Revisor

- [ ] El código es legible y mantenible
- [ ] La lógica es correcta
- [ ] No hay duplicación de código
- [ ] Los tests son adecuados
- [ ] Sigue los principios SOLID
- [ ] Considera casos edge

### Ejemplo de Comentario Constructivo

❌ **Mal:**
```
Este código está mal.
```

✅ **Bien:**
```
Considera usar async/await en lugar de callbacks anidados 
para mejorar la legibilidad. Ejemplo:

async function obtenerLibro(id) {
  const libro = await Book.findById(id);
  const usuario = await User.findById(libro.propietario);
  return { libro, usuario };
}
```

## 📊 Métricas y Retrospectivas

### Métricas a Rastrear

**Kanban:**
- Lead Time
- Cycle Time
- Throughput
- Violaciones de WIP Limits

**Código:**
- Cobertura de tests
- Número de bugs
- Velocidad (story points/semana)

### Retrospectiva Semanal

**Formato Start-Stop-Continue:**

**Start (Empezar a hacer):**
- [Práctica nueva a implementar]

**Stop (Dejar de hacer):**
- [Práctica que no funciona]

**Continue (Continuar haciendo):**
- [Práctica que funciona bien]

## 🛠️ Herramientas Recomendadas

### Kanban
- **Miro** (tablero principal del equipo)

### Pair Programming
- VS Code Live Share
- Discord/Zoom para sesiones remotas
- GitHub Copilot

### Testing
- Jest (JavaScript)
- React Testing Library
- Supertest (API testing)

### CI/CD
- GitHub Actions
- GitLab CI

## 📞 Comunicación del Equipo

### Canales
- **Daily Standup:** Presencial o Discord
- **Decisiones técnicas:** GitHub Issues/Discussions
- **Pair Programming:** VS Code Live Share
- **Retrospectivas:** Documento compartido

### Horarios Sugeridos
- Daily Standup: 10 min al inicio de cada sesión
- Pair Programming: Sesiones de 2 horas
- Retrospectiva: Viernes al final de la semana

## ⚠️ Reglas de Oro

1. 🔴 **NO hacer push directo a `main`**
2. 🟡 **NO exceder límites WIP del Kanban**
3. 🟢 **SÍ escribir tests antes del código (TDD)**
4. 🔵 **SÍ hacer commits pequeños y frecuentes**
5. 🟣 **SÍ rotar parejas en pair programming**
6. 🟠 **SÍ refactorizar cuando sea necesario**

---

**¡Gracias por contribuir a BookShare!** 📚✨
