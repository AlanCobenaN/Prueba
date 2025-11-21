# 📧 Configuración de Verificación de Email

## ✅ Sistema Implementado

Se ha implementado un sistema completo de verificación de email con las siguientes características:

### 🎯 Funcionalidades

1. **Registro con Email de Verificación**
   - Al registrarse, el usuario recibe un email con un enlace de verificación
   - El enlace es válido por 24 horas
   - Se genera un token único y seguro para cada usuario

2. **Página de Verificación**
   - `/verify-email/:token` - Verifica el token del usuario
   - Muestra mensajes de éxito o error
   - Redirige automáticamente al login después de verificar

3. **Reenvío de Email**
   - `/resend-verification` - Permite reenviar el email de verificación
   - Genera un nuevo token si el anterior expiró

4. **Emails HTML Profesionales**
   - Email de verificación con botón y diseño atractivo
   - Email de bienvenida después de verificar
   - Diseño responsivo con colores del tema BookShare

---

## 🔧 Configuración Requerida

### Paso 1: Obtener Credenciales de Gmail

Para usar Gmail como servidor de emails, necesitas una **contraseña de aplicación**:

1. Ve a tu **Cuenta de Google**: https://myaccount.google.com/security
2. Activa la **Verificación en 2 pasos** (si no la tienes)
3. Ve a **Contraseñas de aplicaciones**: https://myaccount.google.com/apppasswords
4. Selecciona:
   - **Aplicación**: Correo
   - **Dispositivo**: Otro (nombre personalizado) → escribe "BookShare"
5. Copia la contraseña de 16 caracteres generada

### Paso 2: Configurar Variables de Entorno

Edita el archivo `backend/.env` y reemplaza estas líneas:

```env
# Configuración de Email (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Ejemplo:**
```env
EMAIL_USER=bookshare.proyecto@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

⚠️ **IMPORTANTE**: 
- Usa tu email de Gmail real
- La contraseña debe ser la **contraseña de aplicación**, NO tu contraseña normal de Gmail
- NO compartas estas credenciales en repositorios públicos

### Paso 3: Reiniciar el Backend

Después de configurar las variables de entorno:

```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Servidor de email listo para enviar mensajes
```

---

## 🧪 Cómo Probar

### 1. Registrar un Usuario

1. Ve a `/register`
2. Llena el formulario con un email REAL
3. Haz clic en "Crear Cuenta"
4. Deberías ver: "Usuario registrado exitosamente. Por favor verifica tu correo electrónico."

### 2. Revisar el Email

1. Abre tu bandeja de entrada del email registrado
2. Busca un email de "BookShare - Verificación de Cuenta"
3. Haz clic en el botón "Verificar mi cuenta"

### 3. Verificar la Cuenta

1. Serás redirigido a `/verify-email/:token`
2. Deberías ver: "¡Email Verificado!"
3. Automáticamente te redirige a `/login` después de 3 segundos

### 4. Probar Reenvío (Opcional)

1. Si el enlace expira, ve a `/resend-verification`
2. Ingresa tu email
3. Recibirás un nuevo email de verificación

---

## 📁 Archivos Creados/Modificados

### Backend

- ✅ `backend/config/email.js` - Configuración de Nodemailer
- ✅ `backend/services/emailService.js` - Funciones de envío de emails
- ✅ `backend/models/User.js` - Agregados campos: `isVerified`, `verificationToken`, `verificationTokenExpires`
- ✅ `backend/controllers/authController.js` - Agregadas funciones: `verifyEmail`, `resendVerificationEmail`
- ✅ `backend/routes/authRoutes.js` - Nuevas rutas de verificación
- ✅ `backend/.env` - Variables `EMAIL_USER` y `EMAIL_PASSWORD`

### Frontend

- ✅ `frontend/src/pages/VerifyEmail.jsx` - Página de verificación
- ✅ `frontend/src/pages/ResendVerification.jsx` - Página de reenvío
- ✅ `frontend/src/App.jsx` - Rutas agregadas

---

## 🔒 Seguridad

- ✅ Tokens generados con `crypto.randomBytes(32)` (64 caracteres hex)
- ✅ Tokens expiran en 24 horas
- ✅ Tokens se eliminan después de usarse
- ✅ Validación en backend antes de verificar
- ✅ Contraseñas de aplicación de Gmail (no expone contraseña real)

---

## 🎨 Diseño de Emails

### Email de Verificación
- Header con gradiente amber
- Icono de libros 📚
- Botón grande de verificación
- Enlace alternativo si el botón no funciona
- Advertencia de expiración (24 horas)

### Email de Bienvenida
- Header con gradiente verde
- Icono de check ✅
- Lista de funcionalidades disponibles
- Mensaje motivacional

---

## ❓ Solución de Problemas

### "Error en la configuración de email"
- Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctamente configurados
- Asegúrate de usar una contraseña de aplicación, no tu contraseña normal
- Verifica que la verificación en 2 pasos esté activada en tu cuenta de Gmail

### "Error al enviar email"
- Revisa la consola del backend para ver el error específico
- Verifica tu conexión a internet
- Asegúrate de que Gmail no esté bloqueando el acceso

### "Token inválido o expirado"
- El enlace solo es válido por 24 horas
- Usa la página de reenvío para obtener un nuevo enlace
- Verifica que hayas copiado el enlace completo

---

## 🚀 Próximos Pasos Opcionales

1. **Emails Transaccionales Avanzados**
   - Email de recuperación de contraseña
   - Email de notificación de nuevo intercambio
   - Email de recordatorio

2. **Servicio de Email Profesional**
   - SendGrid (gratuito hasta 100 emails/día)
   - Mailgun (gratuito hasta 5000 emails/mes)
   - AWS SES (muy económico)

3. **Plantillas Mejoradas**
   - Usar un motor de plantillas como Handlebars
   - Diseños más complejos con CSS inline
   - Imágenes y logos personalizados

---

## 📞 Soporte

Si tienes problemas con la configuración, asegúrate de:
1. Tener las credenciales correctas en `.env`
2. Reiniciar el servidor después de cambiar `.env`
3. Revisar los logs de la consola del backend
4. Verificar la bandeja de spam del email

¡La verificación de email está lista para usar! 🎉
