# Checklist de Entregables - BookShare

## 📦 Lista de Verificación para la Entrega Final

**Fecha límite:** 48 horas antes de las presentaciones

---

## 1. Repositorio Git (2.5 puntos)

### Estructura y Configuración
- [ ] Repositorio en GitHub/GitLab configurado
- [ ] README.md completo y actualizado
- [ ] .gitignore correctamente configurado
- [ ] Archivo .env.example incluido (sin credenciales)
- [ ] CONTRIBUTING.md con guías del equipo

### Historial de Git
- [ ] Commits diarios de todos los miembros
- [ ] Mensajes de commit siguiendo Conventional Commits
- [ ] Commits con co-autores (pair programming)
- [ ] Mínimo 30-40 commits en total (promedio ~2 por día)

### Branches y PRs
- [ ] Branch `main` protegido
- [ ] Branch `develop` para integración
- [ ] Feature branches con nomenclatura correcta
- [ ] Pull Requests con revisión de código
- [ ] Historial claro de merges

### Documentación de Refactorizaciones
- [ ] Commits de refactorización claramente marcados
- [ ] Explicación de cambios en PRs
- [ ] Antes/después documentado cuando sea relevante

---

## 2. Suite de Tests (3.5 puntos - XP)

### Tests Unitarios Backend
- [ ] Tests para modelos (User, Book, Exchange, Review, Message)
- [ ] Tests para controladores
- [ ] Tests para middleware (auth, upload, errorHandler)
- [ ] Tests para utilidades y helpers

### Tests de Integración
- [ ] Tests de API endpoints
- [ ] Tests de flujos completos (registro → login → crear libro)
- [ ] Tests de autenticación y autorización

### Tests Frontend
- [ ] Tests de componentes React
- [ ] Tests de servicios/API calls
- [ ] Tests de contextos (AuthContext)

### Cobertura y Calidad
- [ ] **Cobertura mínima: 80%** ✅
- [ ] Reporte de cobertura generado
- [ ] Tests para funcionalidades críticas:
  - [ ] Sistema de autenticación
  - [ ] Búsqueda de libros
  - [ ] Solicitudes de intercambio
  - [ ] Sistema de calificaciones
  - [ ] Validaciones de datos

### TDD Evidenciado
- [ ] Commits muestran patrón Red-Green-Refactor
- [ ] Tests escritos antes del código (documentado)
- [ ] Ejemplos de ciclo TDD en documentación

---

## 3. Tablero Kanban (2.5 puntos)

### Configuración del Tablero
- [x] Tablero correctamente estructurado:
  - [x] Backlog
  - [x] Por Hacer
  - [x] En Desarrollo
  - [x] En Revisión
  - [x] Testing
  - [x] Hecho
- [x] Límites WIP configurados (2 en Desarrollo, 2 en Testing)
- [x] Todas las tareas categorizadas
- [x] **Link en Miro:** https://miro.com/app/board/uXjVJzSrykY=/

### Documentación Semanal
- [ ] Exportación/Screenshot Semana 1 de Miro
- [ ] Exportación/Screenshot Semana 2 de Miro
- [ ] Exportación/Screenshot Semana 3 de Miro
- [ ] Link del tablero Miro en README

### Métricas Documentadas
- [ ] Lead Time calculado
- [ ] Cycle Time calculado
- [ ] Throughput (tareas/semana)
- [ ] Violaciones de WIP Limits registradas
- [ ] Métricas documentadas en retrospectivas

### Análisis
- [ ] Bloqueos identificados y documentados
- [ ] Cuellos de botella analizados
- [ ] Mejoras implementadas basadas en métricas
- [ ] Análisis incluido en `docs/retrospectivas.md`

---

## 4. Aplicación Web Funcional (2.5 puntos)

### Backend
- [ ] Servidor ejecutándose sin errores
- [ ] MongoDB Atlas conectado y funcionando
- [ ] Todas las rutas API implementadas
- [ ] Autenticación JWT funcional
- [ ] Validaciones de datos implementadas
- [ ] Manejo de errores robusto
- [ ] Subida de imágenes funcional

### Frontend
- [ ] Aplicación React ejecutándose
- [ ] Routing configurado correctamente
- [ ] UI/UX usable y responsive
- [ ] Integración con backend funcionando
- [ ] Manejo de estados correcto
- [ ] Formularios con validación

### Funcionalidades Requeridas Implementadas
- [ ] Registro de usuarios con perfil estudiantil
- [ ] Login/Logout
- [ ] Publicación de libros (título, autor, materia, estado, foto)
- [ ] Búsqueda por título
- [ ] Búsqueda por autor
- [ ] Búsqueda por materia
- [ ] Sistema de solicitud de intercambio
- [ ] Sistema de solicitud de préstamo
- [ ] Calificación y comentarios de intercambios
- [ ] Chat básico entre usuarios

### Base de Datos
- [ ] Base de datos poblada con datos de prueba
- [ ] Mínimo 10 usuarios
- [ ] Mínimo 20 libros
- [ ] Varios intercambios de ejemplo
- [ ] Algunas reseñas

### Calidad Técnica
- [ ] Código limpio y bien organizado
- [ ] Sin código comentado innecesario
- [ ] Sin console.logs en producción
- [ ] Variables con nombres descriptivos
- [ ] Funciones pequeñas y enfocadas

---

## 5. Prácticas XP Aplicadas (3.5 puntos)

### Pair Programming (1.0 punto)
- [ ] Log de sesiones completo en `docs/pair-programming-log.md`
- [ ] Evidencia en commits (co-autores)
- [ ] Rotación de parejas documentada
- [ ] Mínimo 5 sesiones registradas
- [ ] Decisiones técnicas documentadas

### Test-Driven Development (1.5 puntos)
- [ ] Cobertura mayor a 80% ✅
- [ ] Evidencia de ciclo Red-Green-Refactor
- [ ] Tests para módulos críticos
- [ ] Reporte de cobertura incluido

### Integración Continua (0.5 puntos)
- [ ] GitHub Actions configurado
- [ ] Tests automáticos en cada push
- [ ] Build exitoso automático
- [ ] Badge de CI en README

### Refactorización (0.5 puntos)
- [ ] Commits de refactorización identificados
- [ ] Mejoras de código documentadas
- [ ] Sin cambio de funcionalidad (tests pasan)
- [ ] Ejemplos en documentación

---

## 6. Documentación (1.5 puntos)

### README Principal
- [ ] Descripción del proyecto clara
- [ ] Instrucciones de instalación paso a paso
- [ ] Configuración de MongoDB Atlas explicada
- [ ] Comandos para ejecutar la aplicación
- [ ] Lista de tecnologías utilizadas
- [ ] Estructura del proyecto documentada
- [ ] Sección de metodologías ágiles aplicadas

### CONTRIBUTING.md
- [ ] Guía de contribución completa
- [ ] Estándares de código definidos
- [ ] Estrategia de branching explicada
- [ ] Formato de commits especificado
- [ ] Proceso de code review

### Documentación Técnica
- [ ] `docs/pair-programming-log.md`
- [ ] `docs/retrospectivas.md`
- [ ] `docs/decisiones-tecnicas.md`
- [ ] `docs/kanban-analysis.md`
- [ ] Backend README con modelos y endpoints
- [ ] Frontend README con componentes

### Manual de Usuario
- [ ] Capturas de pantalla de flujos principales
- [ ] Guía de uso para usuarios finales
- [ ] Ejemplos de uso

---

## 7. Presentación (1.5 puntos)

### Preparación
- [ ] Slides preparados (10-15 minutos)
- [ ] Demo en vivo ensayada
- [ ] Todos los miembros participan
- [ ] Tiempos asignados a cada sección

### Contenido de la Presentación
- [ ] Introducción al problema
- [ ] Explicación de arquitectura del sistema
- [ ] Demo de funcionalidades principales:
  - [ ] Registro y login
  - [ ] Publicar libro
  - [ ] Buscar libros
  - [ ] Solicitar intercambio
  - [ ] Calificar intercambio
  - [ ] Chat
- [ ] Ejemplos de pair programming
- [ ] Decisiones técnicas tomadas
- [ ] Aplicación de Kanban (mostrar tablero)
- [ ] Aplicación de XP (mostrar evidencia)
- [ ] Retrospectiva y aprendizajes
- [ ] Métricas del proyecto

### Material de Apoyo
- [ ] Diagrama de arquitectura
- [ ] Screenshots del tablero Kanban
- [ ] Gráficos de métricas
- [ ] Ejemplos de código (TDD, refactorización)

---

## 8. Video/Demo (según requisitos)

- [ ] Video de 5 minutos mostrando funcionalidades
- [ ] Calidad de audio y video aceptable
- [ ] Muestra flujos completos de usuario
- [ ] Explicación clara de características
- [ ] Subido a YouTube/Drive
- [ ] Link incluido en README

---

## 9. Entrega en Tiempo

- [ ] Repositorio finalizado 48 horas antes de presentación
- [ ] Todos los documentos completos
- [ ] Video/demo subido
- [ ] Presentación lista
- [ ] Link del repositorio enviado al docente

---

## 10. Extras y Mejoras (Bonus)

- [ ] Deployment en producción (Heroku, Vercel, Railway)
- [ ] CI/CD completo con deployment automático
- [ ] Documentación de API (Swagger/Postman)
- [ ] Diseño UI/UX profesional
- [ ] Características adicionales implementadas
- [ ] Performance optimizado
- [ ] Seguridad reforzada
- [ ] Accesibilidad (a11y)

---

## Verificación Final

### Semana antes de la entrega
- [ ] Revisar este checklist completo
- [ ] Ejecutar tests finales
- [ ] Verificar que todo funcione en máquinas limpias
- [ ] Revisar ortografía en documentación
- [ ] Ensayar presentación completa

### 48 horas antes
- [ ] Último commit al repositorio
- [ ] Verificar que README tenga link correcto
- [ ] Enviar link del repositorio al docente
- [ ] Confirmar que todos los entregables están accesibles

### Día de la presentación
- [ ] Laptop con proyecto funcionando
- [ ] Plan B (backup en USB/cloud)
- [ ] Presentación lista
- [ ] Demo ensayada
- [ ] Equipo preparado

---

## Evaluación Esperada

| Criterio | Puntos | Estado |
|----------|--------|--------|
| Aplicación de Kanban | 2.5 | [ ] |
| Aplicación de XP | 3.5 | [ ] |
| Producto Final | 2.5 | [ ] |
| Documentación y Presentación | 1.5 | [ ] |
| **TOTAL** | **10.0** | [ ] |

---

**Meta del Equipo:** ≥ 9.0 puntos 🎯

**Última actualización:** [Fecha]
**Responsable de verificación:** [Nombre]
