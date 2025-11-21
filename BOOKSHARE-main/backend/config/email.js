import sgMail from '@sendgrid/mail';

let transporter = null;
let emailVerified = false;
let isDevelopmentMode = false;

// Función para inicializar el transporter (se llama la primera vez que se usa)
const initTransporter = () => {
  if (transporter) return; // Ya está inicializado

  // Debug: Verificar que las variables se carguen
  console.log('🔍 Verificando credenciales de email...');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Configurado' : '❌ NO ENCONTRADO');
  console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL ? '✅ Configurado' : '❌ NO ENCONTRADO');

  // Si no hay credenciales, usar modo de desarrollo (simular emails)
  isDevelopmentMode = !process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL;

  if (isDevelopmentMode) {
    console.log('📧 Modo de desarrollo: Los emails se simularán (no se enviarán realmente)');
    // Crear transporter falso para desarrollo
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('📨 [SIMULADO] Email que se enviaría:');
        console.log('   Para:', mailOptions.to);
        console.log('   Asunto:', mailOptions.subject);
        console.log('💡 Para enviar emails reales, configura SENDGRID_API_KEY y SENDGRID_FROM_EMAIL en .env');
        return { messageId: 'dev-message-id' };
      },
      verify: async () => {
        return true;
      }
    };
  } else {
    // Configurar SendGrid con la API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid configurado correctamente');
    
    // Adaptador para mantener compatibilidad con código existente
    transporter = {
      sendMail: async (mailOptions) => {
        const msg = {
          to: mailOptions.to,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: mailOptions.subject,
          html: mailOptions.html,
          // Deshabilitar tracking de clicks y opens para evitar que SendGrid modifique las URLs
          trackingSettings: {
            clickTracking: {
              enable: false
            },
            openTracking: {
              enable: false
            }
          }
        };
        
        try {
          const response = await sgMail.send(msg);
          return { messageId: response[0].headers['x-message-id'] };
        } catch (error) {
          // Mostrar detalles del error de SendGrid
          if (error.response && error.response.body && error.response.body.errors) {
            console.error('❌ Error de SendGrid:', JSON.stringify(error.response.body.errors, null, 2));
          }
          throw error;
        }
      },
      verify: async () => {
        // SendGrid no tiene un método verify, simplemente retornamos true
        return true;
      }
    };
  }
};

// Verificar la configuración del transporter cuando se use
const verifyEmailConfig = async () => {
  // Inicializar el transporter si aún no está inicializado
  initTransporter();
  
  if (emailVerified) return true;
  
  try {
    if (isDevelopmentMode) {
      console.log('✅ Modo de desarrollo activo - Emails simulados');
      emailVerified = true;
      return true;
    }
    
    await transporter.verify();
    console.log('✅ Servidor de email listo para enviar mensajes reales');
    emailVerified = true;
    return true;
  } catch (error) {
    console.log('❌ Error en la configuración de email:', error.message);
    console.log('💡 Verifica SENDGRID_API_KEY y SENDGRID_FROM_EMAIL en el archivo .env');
    console.log('💡 O deja las variables vacías para usar modo de desarrollo');
    return false;
  }
};

// Función para obtener el transporter (lo inicializa si es necesario)
const getTransporter = () => {
  initTransporter();
  return transporter;
};

// Exportar funciones
export { getTransporter, verifyEmailConfig };
export default getTransporter;
