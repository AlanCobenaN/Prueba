# Guía de Pruebas - Sistema de Chat en Tiempo Real

## 🧪 Cómo Probar el Chat

### Preparación

1. **Iniciar el Backend:**
```bash
cd backend
npm run dev
```
Debe mostrar: "Servidor corriendo en puerto 5000"

2. **Iniciar el Frontend:**
```bash
cd frontend
npm run dev
```
Debe mostrar: "Local: http://localhost:5173/"

3. **Crear dos usuarios:**
   - Abrir navegador en modo normal: `http://localhost:5173`
   - Abrir navegador en modo incógnito: `http://localhost:5173`
   - Registrar dos usuarios diferentes

### 📝 Casos de Prueba

#### Caso 1: Iniciar Chat desde un Libro

**Pasos:**
1. Usuario A: Publicar un libro en "Mis Libros"
2. Usuario B: Ir a "Libros" y buscar el libro de Usuario A
3. Usuario B: Hacer clic en el libro para ver detalles
4. Usuario B: Hacer clic en "Enviar Mensaje"
5. Se debe abrir la página de chat con Usuario A

**Resultado Esperado:**
- ✅ Se abre la página de chat
- ✅ Usuario A aparece como "En línea" (punto verde)
- ✅ Se puede escribir y enviar mensaje

#### Caso 2: Enviar y Recibir Mensajes en Tiempo Real

**Pasos:**
1. Usuario A y Usuario B en la misma conversación
2. Usuario A: Escribir "Hola" y enviar
3. Usuario B: Debe ver el mensaje instantáneamente (sin recargar)
4. Usuario B: Responder "Hola, ¿cómo estás?"
5. Usuario A: Debe ver la respuesta instantáneamente

**Resultado Esperado:**
- ✅ Mensajes aparecen en tiempo real
- ✅ Mensajes propios alineados a la derecha (azul)
- ✅ Mensajes recibidos alineados a la izquierda (gris)
- ✅ Cada mensaje tiene timestamp

#### Caso 3: Indicador "Escribiendo..."

**Pasos:**
1. Usuario A y Usuario B en la misma conversación
2. Usuario A: Comenzar a escribir (no enviar)
3. Usuario B: Debe ver "Escribiendo..." debajo del header
4. Usuario A: Dejar de escribir por 1 segundo
5. Usuario B: El indicador debe desaparecer

**Resultado Esperado:**
- ✅ Aparece "Escribiendo..." mientras el otro escribe
- ✅ Desaparece 1 segundo después de dejar de escribir

#### Caso 4: Estado En Línea/Desconectado

**Pasos:**
1. Usuario A y Usuario B conectados
2. Usuario B: Verificar que Usuario A tiene punto verde
3. Usuario A: Cerrar la ventana/tab
4. Usuario B: Debe ver que Usuario A ya no tiene punto verde
5. Usuario A: Volver a abrir y entrar al chat
6. Usuario B: Debe ver punto verde de nuevo

**Resultado Esperado:**
- ✅ Punto verde cuando usuario está en línea
- ✅ Sin punto cuando usuario está desconectado
- ✅ Actualización automática del estado

#### Caso 5: Lista de Conversaciones

**Pasos:**
1. Usuario A: Enviar mensaje a Usuario B
2. Usuario A: Enviar mensaje a Usuario C (otro usuario)
3. Usuario A: Ir a "Chat"
4. Debe ver lista con Usuario B y Usuario C
5. Hacer clic en Usuario B
6. Debe cargar conversación con Usuario B

**Resultado Esperado:**
- ✅ Aparecen todas las conversaciones
- ✅ Se muestra el último mensaje
- ✅ Al hacer clic se carga la conversación completa
- ✅ Conversación activa se resalta

#### Caso 6: Persistencia de Mensajes

**Pasos:**
1. Usuario A: Enviar varios mensajes a Usuario B
2. Usuario A: Recargar la página (F5)
3. Usuario A: Ir nuevamente al chat con Usuario B
4. Debe ver todos los mensajes enviados anteriormente

**Resultado Esperado:**
- ✅ Mensajes se guardan en base de datos
- ✅ Al recargar se mantiene el historial
- ✅ Orden cronológico correcto

#### Caso 7: Chat desde Intercambios

**Pasos:**
1. Usuario A: Publicar un libro
2. Usuario B: Solicitar intercambio del libro
3. Usuario A: Ir a "Mis Intercambios" → "Recibidas"
4. Usuario A: Hacer clic en botón "Chat" de la solicitud de Usuario B
5. Debe abrir chat con Usuario B

**Resultado Esperado:**
- ✅ Se abre el chat correcto
- ✅ Si ya hay mensajes, se cargan
- ✅ Se puede enviar nuevos mensajes

#### Caso 8: Responsive Design

**Pasos - Desktop:**
1. Abrir en pantalla grande (>768px)
2. Debe ver lista de conversaciones a la izquierda
3. Debe ver chat activo a la derecha

**Pasos - Mobile:**
1. Abrir en pantalla pequeña (<768px)
2. Debe ver solo lista de conversaciones
3. Al seleccionar una, debe mostrar solo el chat
4. Debe tener botón "volver" para regresar a la lista

**Resultado Esperado:**
- ✅ Desktop: Vista dividida
- ✅ Mobile: Vista única con navegación

### 🔍 Verificación en Consola del Navegador

Abrir DevTools (F12) y verificar:

```javascript
// Debe aparecer:
"Socket conectado: [socket-id]"
"Usuario [user-id] registrado con socket [socket-id]"

// No debe aparecer:
"Error de conexión socket"
"Socket desconectado: transport error"
```

### 📊 Verificación en Base de Datos

Usando MongoDB Compass o mongosh:

```javascript
// Ver mensajes guardados
db.messages.find().pretty()

// Verificar estructura
{
  _id: ObjectId(...),
  remitente: ObjectId(...),
  destinatario: ObjectId(...),
  contenido: "Mensaje de prueba",
  leido: false,
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

## ⚠️ Problemas Comunes

### Problema 1: Socket no conecta

**Síntomas:**
- No aparece punto verde
- Mensajes no llegan en tiempo real

**Solución:**
1. Verificar que backend está corriendo en puerto 5000
2. Verificar en consola: `socket.connected` debe ser `true`
3. Revisar configuración CORS en `server.js`

### Problema 2: "Escribiendo..." no desaparece

**Síntomas:**
- El indicador se queda permanentemente

**Solución:**
1. Verificar que evento `stop-typing` se emite correctamente
2. Limpiar caché del navegador
3. Verificar timeout de 1 segundo en `handleTyping`

### Problema 3: Mensajes duplicados

**Síntomas:**
- Un mensaje aparece dos veces

**Solución:**
1. Verificar que no hay múltiples listeners del mismo evento
2. Limpiar listeners en cleanup de `useEffect`
3. Verificar que no se llama dos veces a `sendMessage`

### Problema 4: Conversaciones no aparecen

**Síntomas:**
- Lista de conversaciones vacía pero hay mensajes

**Solución:**
1. Verificar que hay al menos un mensaje intercambiado
2. Revisar agregación en `getConversations` del backend
3. Verificar que usuarios están poblados correctamente

## 📈 Métricas de Rendimiento

### Tiempo de Respuesta
- Envío de mensaje: < 100ms
- Recepción en tiempo real: < 50ms
- Carga de conversaciones: < 500ms
- Carga de historial: < 1s

### Prueba de Carga
```bash
# Simular múltiples usuarios conectados
for i in {1..10}; do
  echo "Conectando usuario $i"
  # Abrir nueva ventana incógnito
done
```

## ✅ Checklist de Pruebas

- [ ] Enviar mensaje desde Usuario A a Usuario B
- [ ] Recibir mensaje en tiempo real
- [ ] Ver indicador "escribiendo..."
- [ ] Ver estado en línea/desconectado
- [ ] Persistencia después de recargar
- [ ] Chat desde detalles de libro
- [ ] Chat desde intercambios
- [ ] Lista de conversaciones completa
- [ ] Responsive en móvil
- [ ] Responsive en tablet
- [ ] Responsive en desktop
- [ ] Scroll automático a nuevos mensajes
- [ ] Timestamps en mensajes
- [ ] Avatar de usuarios
- [ ] Diseño consistente

## 🎯 Casos Edge

1. **Mensaje muy largo:** Enviar mensaje de 1000 caracteres
2. **Caracteres especiales:** Enviar: `<script>alert('XSS')</script>`
3. **Emoji:** Enviar: `😀 🎉 ✨`
4. **Mensaje vacío:** Intentar enviar solo espacios
5. **Conexión lenta:** Throttling en DevTools Network
6. **Desconexión:** Desconectar WiFi y volver a conectar

---

**Estado del Sistema:** ✅ Completamente Funcional

**Última Actualización:** Noviembre 2025
