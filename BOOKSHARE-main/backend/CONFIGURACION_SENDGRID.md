# 📧 Configuración de Email con SendGrid

## ¿Por qué SendGrid?

- ✅ **100 emails gratis por día** (permanente)
- ✅ **No necesitas un email personal** (cada desarrollador configura su propia cuenta)
- ✅ **Profesional y confiable** para producción
- ✅ **Fácil de configurar** (solo necesitas una API Key)
- ✅ **Modo de desarrollo incluido** (si no configuras SendGrid, los emails se simulan en la consola)

## 📋 Pasos para configurar SendGrid

### 1. Crear cuenta en SendGrid (GRATIS)

1. Ve a [https://sendgrid.com](https://sendgrid.com)
2. Haz clic en "Start for Free"
3. Completa el registro con tu email
4. Verifica tu cuenta desde el email que te envíen

### 2. Obtener tu API Key

1. Una vez dentro, ve a **Settings** > **API Keys** (en el menú lateral)
2. Haz clic en **"Create API Key"**
3. Dale un nombre descriptivo, por ejemplo: `BookShare Dev`
4. Selecciona **"Full Access"** o al menos **"Mail Send"** en los permisos
5. Haz clic en **"Create & View"**
6. **¡IMPORTANTE!** Copia la API Key (solo se muestra una vez)
   - La API Key se verá algo así: `SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyy`

### 3. Verificar tu email de remitente

SendGrid requiere que verifiques el email desde el cual enviarás los correos:

1. Ve a **Settings** > **Sender Authentication**
2. Opción A: **Single Sender Verification** (más rápido)
   - Haz clic en "Verify a Single Sender"
   - Completa el formulario con tu información
   - Verifica el email que te envíen
   
3. Opción B: **Domain Authentication** (más profesional, pero requiere acceso al DNS)
   - Sigue las instrucciones para verificar tu dominio
   - Esto te permite enviar desde cualquier email de tu dominio

### 4. Configurar el archivo .env

Abre el archivo `backend/.env` y agrega:

```env
SENDGRID_API_KEY=SG.tu_api_key_aqui
SENDGRID_FROM_EMAIL=email@verificado.com
```

**Ejemplo:**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyy
SENDGRID_FROM_EMAIL=noreply@tudominio.com
```

### 5. Reiniciar el servidor

```bash
cd backend
npm run dev
```

Deberías ver en la consola:
```
🔍 Verificando credenciales de email...
SENDGRID_API_KEY: ✅ Configurado
SENDGRID_FROM_EMAIL: ✅ Configurado
✅ Modo de desarrollo activo - Emails simulados
```

## 🧪 Modo de Desarrollo (Sin configurar SendGrid)

Si **NO** configuras `SENDGRID_API_KEY` y `SENDGRID_FROM_EMAIL`, el sistema automáticamente entrará en **modo de desarrollo**.

**En modo desarrollo:**
- ✅ El servidor funcionará normalmente
- ✅ Los usuarios pueden registrarse
- ✅ Los emails NO se envían realmente
- ✅ Los emails se muestran en la **consola del backend**

**Verás algo así en la consola:**
```
📨 [SIMULADO] Email que se enviaría:
   Para: usuario@example.com
   Asunto: Verifica tu cuenta de BookShare
💡 Para enviar emails reales, configura SENDGRID_API_KEY y SENDGRID_FROM_EMAIL en .env
```

Esto es útil para:
- Desarrollo local sin necesitar configuración
- Testing rápido de funcionalidades
- Trabajar sin conexión a internet

## 🚀 Para Producción

Cuando publiques tu aplicación en producción (Railway, Render, Heroku, etc.):

1. Crea una cuenta de SendGrid **en producción** (puede ser la misma gratuita)
2. Genera una nueva API Key específica para producción
3. Configura las variables de entorno en tu plataforma:
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`

## 📊 Monitorear emails enviados

SendGrid te da un dashboard para ver:
- Cuántos emails se enviaron
- Cuántos fueron abiertos
- Cuántos rebotaron
- Errores de envío

Ve a: **Activity** > **Email Activity**

## ❓ Troubleshooting

### Error: "Forbidden"
- Verifica que tu API Key tenga permisos de "Mail Send"
- Asegúrate de que copiaste la API Key completa

### Error: "The from address does not match a verified Sender Identity"
- Debes verificar tu email en **Settings** > **Sender Authentication**
- El email en `SENDGRID_FROM_EMAIL` debe estar verificado

### Los emails no llegan
- Revisa la sección **Activity** en SendGrid
- Verifica que el email del destinatario sea válido
- Los emails pueden tardar unos minutos en llegar

### Límite de 100 emails/día excedido
- Considera actualizar tu plan de SendGrid
- O usa otro servicio como Mailgun (5000 emails/mes gratis)

## 🆚 Comparación con Gmail

| Característica | Gmail (anterior) | SendGrid (actual) |
|---------------|------------------|-------------------|
| Configuración | Requiere contraseña de app | Solo API Key |
| Límite diario | 500 emails | 100 emails gratis |
| Para producción | ❌ No recomendado | ✅ Profesional |
| Cada dev necesita | Su propio Gmail | Su propia cuenta |
| Modo desarrollo | ❌ No incluido | ✅ Automático |
| Dashboard | ❌ No | ✅ Estadísticas |

## 📚 Recursos adicionales

- [Documentación oficial de SendGrid](https://docs.sendgrid.com/)
- [SendGrid Node.js Library](https://github.com/sendgrid/sendgrid-nodejs)
- [Plantillas de email en SendGrid](https://sendgrid.com/solutions/email-marketing/email-templates/)
