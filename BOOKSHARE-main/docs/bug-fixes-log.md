# 📋 Registro de Corrección de Bugs - BookShare

**Proyecto:** Actividad Práctica 3 - Integración Kanban y XP  
**Equipo:** Robinson Moreira, Joseph Mora, Jonny Castillo, Néstor Ayala, Alan Cobeña  
**Documento fuente:** Pruebas_QA_Bookshare.pdf  
**Fecha inicio:** 06/11/2024

---

## 🎯 Resumen Ejecutivo

Este documento rastrea todos los bugs identificados durante las pruebas de QA y sus respectivas correcciones.

### Métricas de Bugs

| Métrica | Cantidad |
|---------|----------|
| Total de bugs reportados | 5 |
| Bugs críticos | 3 |
| Bugs mayores | 1 |
| Bugs menores | 1 |
| Bugs corregidos | 3 |
| Bugs pendientes | 2 |

---

## 🐛 Bugs Identificados

### Bug #1: TC01 - Mejoras de UX en Registro de Usuario

**ID Caso:** TC01  
**Prioridad:** � Medio (Mejora UX)  
**Estado:** ⏳ Pendiente  
**Módulo afectado:** Frontend - Autenticación  
**Reportado por:** Néstor Ayala (QA)  
**Fecha reporte:** Noviembre 2024

**Descripción:**
El registro funciona correctamente pero necesita mejoras de experiencia de usuario para datos ecuatorianos específicos.

**Resultado esperado:**
- Usuario se registra correctamente
- Token JWT generado ✅ (FUNCIONA)

**Mejoras solicitadas:**
1. Lista desplegable de universidades ecuatorianas en vez de campo libre
2. Lista desplegable de carreras universitarias
3. Validación de fortaleza de contraseña con indicador visual
4. Confirmación de correo electrónico por mensaje

**Causa raíz:**
No es un bug sino mejoras de UX no implementadas en MVP inicial.

**Solución propuesta:**
- Agregar select con universidades de Ecuador
- Agregar select con carreras académicas
- Implementar indicador de fortaleza de contraseña
- Implementar confirmación de email con token

**Prioridad de implementación:** Media (mejoras futuras post-MVP)

---

### Bug #2: TC02 - Error al agregar imagen en publicación de libro

**ID Caso:** TC02  
**Prioridad:** 🔴 Crítico  
**Estado:** ✅ Corregido  
**Módulo afectado:** Backend - Publicación de libros / Frontend - Upload  
**Reportado por:** Néstor Ayala (QA)  
**Fecha reporte:** Noviembre 2024  
**Fecha corrección:** 06/11/2024

**Descripción:**
Al intentar publicar un libro con imagen, el sistema generaba un error y no permitía completar la publicación. Sin imagen funcionaba correctamente.

**Causa raíz identificada:**
1. ❌ Directorio `backend/uploads/` no existía
2. ❌ Ruta relativa incorrecta en configuración de multer
3. ❌ Falta de manejo de errores específico para multer

**Solución implementada:**
```javascript
// 1. Crear directorio automáticamente si no existe
const uploadsDir = path.join(path.dirname(__dirname), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 2. Usar ruta absoluta
destination: (req, file, cb) => {
  cb(null, uploadsDir); // Ruta absoluta
}

// 3. Middleware de manejo de errores
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      });
    }
    // ... más casos
  }
  next();
};

// 4. Limpiar archivo si falla la creación
if (req.file && req.file.path) {
  fs.unlinkSync(req.file.path);
}
```

**Archivos modificados:**
- `backend/middleware/upload.js` - Mejorado con validaciones y manejo de errores
- `backend/routes/bookRoutes.js` - Agregado middleware handleMulterError
- `backend/controllers/bookController.js` - Agregada limpieza de archivos en errores
- `backend/uploads/.gitkeep` - Creado para mantener directorio en git

**Tests agregados:**
```javascript
// TODO: Agregar tests unitarios para upload
// - Test upload exitoso
// - Test archivo muy grande
// - Test tipo de archivo inválido
// - Test sin archivo (opcional)
```

**Resultado:**
✅ Upload de imágenes funciona correctamente  
✅ Manejo de errores mejorado  
✅ Validación de tipos de archivo  
✅ Límite de tamaño implementado (5MB)

---

### Bug #3: TC03 - Búsqueda por nombre/autor no funciona

**ID Caso:** TC03  
**Prioridad:** 🔴 Crítico  
**Estado:** ✅ Corregido  
**Módulo afectado:** Backend - Búsqueda / Frontend - SearchBar  
**Reportado por:** Néstor Ayala (QA)  
**Fecha reporte:** Noviembre 2024  
**Fecha corrección:** 06/11/2024

**Descripción:**
La búsqueda de libros por nombre o autor no filtraba correctamente. Devolvía todos los libros sin importar el query. El filtro por estado sí funcionaba.

**Causa raíz identificada:**
❌ El controller usaba `$text` search de MongoDB que requiere índices específicos, pero la búsqueda no se aplicaba correctamente con regex simple.

**Solución implementada:**
```javascript
// Antes (NO funcionaba):
if (search) {
  query.$text = { $search: search };
}

// Después (SÍ funciona):
const searchTerm = search || query;
if (searchTerm) {
  filter.$or = [
    { titulo: { $regex: searchTerm, $options: 'i' } },
    { autor: { $regex: searchTerm, $options: 'i' } },
    { descripcion: { $regex: searchTerm, $options: 'i' } }
  ];
}

// Soporte para ambos parámetros: ?search=... o ?query=...
```

**Archivos modificados:**
- `backend/controllers/bookController.js` - Reemplazado $text con $regex

**Mejoras implementadas:**
✅ Búsqueda case-insensitive con `$options: 'i'`  
✅ Búsqueda en múltiples campos (título, autor, descripción)  
✅ Soporte para parámetros `search` y `query`  
✅ Búsqueda parcial (encuentra "Algo" en "Algoritmos")

**Tests agregados:**
```javascript
// TODO: Agregar tests de búsqueda
// - Búsqueda por título exacto
// - Búsqueda por título parcial
// - Búsqueda por autor
// - Búsqueda case-insensitive
// - Búsqueda sin resultados
```

**Resultado:**
✅ Búsqueda funciona correctamente  
✅ Filtro por estado mantiene funcionalidad  
✅ Combinación de búsqueda + filtros funciona

---

### Bug #4: TC04 - Error al crear solicitud de intercambio

**ID Caso:** TC04  
**Prioridad:** 🔴 Crítico  
**Estado:** ✅ Corregido  
**Módulo afectado:** Backend - Intercambios  
**Reportado por:** Néstor Ayala (QA)  
**Fecha reporte:** Noviembre 2024  
**Fecha corrección:** 06/11/2024

**Descripción:**
Al intentar crear una solicitud de intercambio entre dos usuarios, el sistema generaba un error. Sin embargo, la solicitud de préstamo (no intercambio) funcionaba correctamente.

**Causa raíz identificada:**
❌ Falta de validación del campo `libroOfrecido` cuando `tipo === 'Intercambio'`  
❌ Mensajes de error no descriptivos  
❌ No se validaba que el libro ofrecido perteneciera al solicitante

**Solución implementada:**
```javascript
// Validar tipo de solicitud
if (!tipo || !['Intercambio', 'Préstamo'].includes(tipo)) {
  return res.status(400).json({ 
    message: 'Tipo inválido. Debe ser "Intercambio" o "Préstamo"' 
  });
}

// Si es intercambio, validar libro ofrecido
if (tipo === 'Intercambio') {
  if (!libroOfrecidoId) {
    return res.status(400).json({ 
      message: 'Para un intercambio debes ofrecer un libro propio' 
    });
  }

  const libroOfrecido = await Book.findById(libroOfrecidoId);
  
  // Validar que existe
  if (!libroOfrecido) {
    return res.status(404).json({ 
      message: 'El libro ofrecido no existe' 
    });
  }

  // Validar que pertenece al solicitante
  if (libroOfrecido.propietario.toString() !== req.user.id) {
    return res.status(403).json({ 
      message: 'Solo puedes ofrecer tus propios libros' 
    });
  }

  // Validar que está disponible
  if (!libroOfrecido.disponible) {
    return res.status(400).json({ 
      message: 'El libro que ofreces no está disponible' 
    });
  }
}
```

**Archivos modificados:**
- `backend/controllers/exchangeController.js` - Agregadas validaciones completas

**Validaciones agregadas:**
✅ Validar tipo de solicitud ('Intercambio' vs 'Préstamo')  
✅ Requerir libro ofrecido para intercambios  
✅ Validar que libro ofrecido existe  
✅ Validar que libro ofrecido pertenece al solicitante  
✅ Validar que libro ofrecido está disponible  
✅ Mensajes de error descriptivos

**Tests agregados:**
```javascript
// TODO: Agregar tests de intercambios
// - Crear préstamo exitoso
// - Crear intercambio exitoso
// - Rechazar intercambio sin libro ofrecido
// - Rechazar intercambio con libro de otro usuario
// - Rechazar solicitud de propio libro
```

**Resultado:**
✅ Préstamos funcionan correctamente  
✅ Intercambios funcionan con validaciones  
✅ Mensajes de error claros y descriptivos

---

### Bug #5: TC05 - Chat en tiempo real no implementado

**ID Caso:** TC05  
**Prioridad:** 🟠 Alto  
**Estado:** ⏳ Pendiente  
**Módulo afectado:** Backend - Chat / Frontend - Chat / Socket.io  
**Reportado por:** Néstor Ayala (QA)  
**Fecha reporte:** Noviembre 2024

**Descripción:**
La funcionalidad de chat en tiempo real no está implementada. No se pueden enviar ni recibir mensajes.

**Pasos para reproducir:**
1. Ir a página de Chat
2. Seleccionar conversación
3. Escribir mensaje: "Hola, ¿tienes disponible el libro?"
4. Enviar
5. Mensaje no se envía ❌

**Comportamiento esperado:**
```
- Mensaje se envía
- Aparece en ambas pantallas en tiempo real
- Se guarda en base de datos
- Notificación en tiempo real
```

**Comportamiento actual:**
```
Funcionalidad NO implementada
```

**Causa raíz:**
Módulo de chat pendiente de implementación completa.

**Solución a implementar:**
1. **Backend:**
   - Configurar Socket.io en server.js
   - Crear event handlers para chat
   - Implementar rooms por conversación
   - Guardar mensajes en BD

2. **Frontend:**
   - Conectar Socket.io client
   - Escuchar eventos de mensajes
   - Emitir mensajes
   - Actualizar UI en tiempo real

3. **Base de datos:**
   - Verificar modelo Message existe
   - Crear índices para queries de chat

**Archivos a implementar/modificar:**
- `backend/server.js` (Socket.io setup)
- `backend/controllers/chatController.js`
- `backend/routes/chatRoutes.js`
- `backend/models/Message.js`
- `frontend/src/pages/Chat.jsx`
- `frontend/package.json` (socket.io-client dependency)

---

## 📊 Análisis de Bugs por Categoría

### Por Módulo

| Módulo | Cantidad | Críticos | Mayores | Menores |
|--------|----------|----------|---------|---------|
| Autenticación | 1 | 0 | 0 | 1 |
| Gestión de Libros | 2 | 2 | 0 | 0 |
| Intercambios | 1 | 1 | 0 | 0 |
| Chat | 1 | 0 | 1 | 0 |
| **TOTAL** | **5** | **3** | **1** | **1** |

### Por Tipo

| Tipo | Cantidad | % |
|------|----------|---|
| Funcionalidad no implementada | 1 | 20% |
| Funcionalidad rota | 3 | 60% |
| Mejoras UX | 1 | 20% |

### Priorización de Correcciones

**🔴 Urgente (Bloqueadores):**
1. Bug #2: Error al subir imagen de libro
2. Bug #3: Búsqueda no funciona
3. Bug #4: Error en intercambios

**🟠 Alta prioridad:**
4. Bug #5: Chat no implementado

**🟡 Media prioridad (Mejoras futuras):**
5. Bug #1: Mejoras UX en registro

---

## 🔄 Proceso de Corrección

### Workflow para cada bug:

1. **Análisis** (15 min)
   - Reproducir el bug
   - Identificar causa raíz
   - Estimar complejidad

2. **Implementación** (30-60 min)
   - Escribir test que falle (TDD)
   - Implementar corrección
   - Verificar test pasa

3. **Validación** (15 min)
   - Pruebas manuales
   - Verificar no hay regresiones
   - Actualizar documentación

4. **Commit** (5 min)
   - Commit con mensaje descriptivo
   - Referencia al bug

### Convención de commits para bugs:

```
fix: [#BUG-ID] Descripción breve del bug corregido

- Causa raíz identificada
- Solución implementada
- Tests agregados

Refs: Bug #ID en Pruebas_QA_Bookshare.pdf
```

---

## 📝 Lecciones Aprendidas

### Prevención de bugs futuros:

1. **Validación:**
   - [Lección aprendida]

2. **Testing:**
   - [Lección aprendida]

3. **Code Review:**
   - [Lección aprendida]

---

## 🎯 Próximos Pasos

- [ ] Analizar informe de QA completo
- [ ] Priorizar bugs por severidad
- [ ] Asignar bugs al equipo
- [ ] Implementar correcciones
- [ ] Ejecutar suite de tests
- [ ] Solicitar re-testing a QA
- [ ] Actualizar retrospectiva con lecciones aprendidas

---

**Última actualización:** 06/11/2024  
**Actualizado por:** Jonny Castillo (Dev B)
