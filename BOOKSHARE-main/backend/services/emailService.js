import { getTransporter, verifyEmailConfig } from '../config/email.js';

// Enviar email de verificación
export const sendVerificationEmail = async (email, token, userName) => {
  try {
    console.log('📧 Intentando enviar email de verificación...');
    console.log('   📨 Para:', email);
    console.log('   👤 Usuario:', userName);
    console.log('   🔑 Token:', token);
    console.log('   🔗 Token length:', token.length);
    
    // Verificar configuración antes de enviar
    await verifyEmailConfig();
    
    const transporter = getTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
    
    console.log('   🌐 URL de verificación completa:', verificationUrl);
    console.log('   📏 URL length:', verificationUrl.length);

    const mailOptions = {
      from: `"BookShare - Verificación de Cuenta" <${process.env.SENDGRID_FROM_EMAIL || 'noreply@bookshare.com'}>`,
      to: email,
      subject: '✅ Verifica tu cuenta en BookShare',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #B45309, #D97706);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
            background-color: #FFF7ED;
            border-radius: 0 0 10px 10px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">📚</div>
            <h1>¡Bienvenido a BookShare!</h1>
          </div>
          <div class="content">
            <h2 style="color: #B45309;">Hola ${userName},</h2>
            <p>¡Gracias por registrarte en BookShare! Estamos emocionados de tenerte en nuestra comunidad de intercambio de libros universitarios.</p>
            
            <p>Para completar tu registro y activar tu cuenta, por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="background-color: #D97706; border-radius: 8px;">
                        <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 15px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                          Verificar mi cuenta
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
              <span style="color: #D97706; word-break: break-all; display: block; margin-top: 10px; padding: 10px; background-color: #FEF3C7; border-radius: 4px;">${verificationUrl}</span>
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              <strong>Nota:</strong> Este enlace expirará en 24 horas por seguridad.
            </p>
            
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px;">
              Si no creaste una cuenta en BookShare, puedes ignorar este correo de forma segura.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 BookShare - Plataforma de Intercambio de Libros Universitarios</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    console.log('   🚀 Enviando email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de verificación enviado exitosamente');
    console.log('   📬 Destinatario:', email);
    console.log('   🆔 Message ID:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('   📋 Detalles:', JSON.stringify(error.response.body.errors, null, 2));
    }
    throw new Error('Error al enviar el correo de verificación');
  }
};

// Enviar email de bienvenida después de verificar
export const sendWelcomeEmail = async (email, userName) => {
  // Verificar configuración antes de enviar
  await verifyEmailConfig();
  
  const transporter = getTransporter();
  const mailOptions = {
    from: `"BookShare" <${process.env.SENDGRID_FROM_EMAIL || 'noreply@bookshare.com'}>`,
    to: email,
    subject: '🎉 ¡Cuenta verificada exitosamente!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #059669, #10B981);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 30px;
            background-color: #F0FDF4;
            border-radius: 0 0 10px 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="font-size: 48px; margin: 0;">✅</h1>
            <h2 style="margin: 10px 0 0 0;">¡Cuenta Verificada!</h2>
          </div>
          <div class="content">
            <h2 style="color: #059669;">¡Hola ${userName}!</h2>
            <p>Tu cuenta ha sido verificada exitosamente. Ya puedes disfrutar de todas las funciones de BookShare:</p>
            <ul style="color: #666;">
              <li>📚 Publicar tus libros</li>
              <li>🔄 Intercambiar con otros estudiantes</li>
              <li>💬 Chatear en tiempo real</li>
              <li>⭐ Calificar tus intercambios</li>
            </ul>
            <p>¡Comienza a compartir conocimiento con la comunidad universitaria!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de bienvenida enviado a: ${email}`);
  } catch (error) {
    console.error('❌ Error al enviar email de bienvenida:', error);
  }
};
