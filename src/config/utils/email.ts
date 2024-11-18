import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


const transportConfig: SMTPTransport.Options = {
    host: "mubai.com.mx",
    port: 465,
    secure: true,
    auth: {
      user: "x@mubai.com.mx",
      pass: "testmailing77/"
    },
  };

  
const transporter = nodemailer.createTransport(transportConfig);

interface EmailServiceConfig {
    user: string;
    // Add other email service configuration properties if needed
  }
  
  interface AppConfig {
    emailService: EmailServiceConfig;
    // Add other config properties if needed
  }
  
  export const sendVerificationEmail = async (
    email: string, 
    code: string,
  ): Promise<void> => {
      const currentYear = new Date().getFullYear();
      
      const html = `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirma tu correo electrónico - Soul Gate</title>
              <style>
                  body {
                      font-family: 'Arial', sans-serif;
                      line-height: 1.6;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      background: white;
                      border-radius: 8px;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  }
                  .header {
                      background: #1a2634;
                      padding: 20px;
                      text-align: center;
                      border-radius: 8px 8px 0 0;
                  }
                  .header h1 {
                      color: #ffffff;
                      font-size: 28px;
                      margin: 0;
                      font-family: 'Georgia', serif;
                  }
                  .content {
                      padding: 30px;
                      color: #333;
                  }
                  .verification-code {
                      background: #f8f9fa;
                      border-radius: 6px;
                      padding: 20px;
                      margin: 20px 0;
                      text-align: center;
                      border: 2px dashed #1a2634;
                  }
                  .verification-code h2 {
                      color: #1a2634;
                      font-size: 32px;
                      letter-spacing: 5px;
                      margin: 0;
                  }
                  .button {
                      display: inline-block;
                      background: #1a2634;
                      color: white;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 4px;
                      margin: 20px 0;
                  }
                  .footer {
                      padding: 20px 30px;
                      background: #f8f9fa;
                      border-radius: 0 0 8px 8px;
                      color: #666;
                      font-size: 14px;
                      text-align: center;
                  }
                  .social-links {
                      margin: 20px 0;
                  }
                  .social-links a {
                      margin: 0 10px;
                      color: #1a2634;
                      text-decoration: none;
                      font-weight: bold;
                  }
                  .divider {
                      height: 1px;
                      background-color: #e0e0e0;
                      margin: 20px 0;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Soul Gate</h1>
                  </div>
                  <div class="content">
                      <h2>¡Bienvenido a Soul Gate!</h2>
                      <p>Nos alegra tenerte con nosotros. Estás a un paso de comenzar tu viaje con Soul Gate.</p>
                      
                      <div class="verification-code">
                          <p>Tu código de verificación es:</p>
                          <h2>${code}</h2>
                      </div>
  
                      <p>Ya estás en camino de crear experiencias increíbles. Si tienes alguna pregunta o necesitas ayuda, nuestro equipo está aquí para apoyarte.</p>
                      
                      <div class="divider"></div>
                      
                      <p><strong>¿Por qué verificar tu correo?</strong></p>
                      <ul>
                          <li>Mantener tu cuenta segura</li>
                          <li>Recibir actualizaciones importantes</li>
                          <li>Acceder a todas las funciones de Soul Gate</li>
                      </ul>
                  </div>
                  
                  <div class="footer">
                      <div class="social-links">
                          <a href="#">Facebook</a>
                          <a href="#">Twitter</a>
                          <a href="#">Instagram</a>
                          <a href="#">LinkedIn</a>
                      </div>
                      <p>© ${currentYear} Soul Gate. Todos los derechos reservados.</p>
                      <p>
                          Si no solicitaste este correo, puedes ignorarlo de manera segura.<br>
                          <a href="[UNSUBSCRIBE_URL]" style="color: #666;">Cancelar suscripción</a>
                      </p>
                  </div>
              </div>
          </body>
          </html>
      `;
  
      try {
          await transporter.sendMail({
              from: config.emailService.user,
              to: email,
              subject: 'Verifica tu correo electrónico - Soul Gate',
              html: html
          });
      } catch (error) {
          console.error('Error sending verification email:', error);
          throw new Error('Failed to send verification email');
      }
  };
  
  export const sendPasswordResetEmail = async (
    email: string, 
    code: string,
  ): Promise<void> => {
      const currentYear = new Date().getFullYear();
      
      const html = `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Restablece tu contraseña - Soul Gate</title>
              <style>
                  body {
                      font-family: 'Arial', sans-serif;
                      line-height: 1.6;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      background: white;
                      border-radius: 8px;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  }
                  .header {
                      background: #1a2634;
                      padding: 20px;
                      text-align: center;
                      border-radius: 8px 8px 0 0;
                  }
                  .header h1 {
                      color: #ffffff;
                      font-size: 28px;
                      margin: 0;
                      font-family: 'Georgia', serif;
                  }
                  .content {
                      padding: 30px;
                      color: #333;
                  }
                  .reset-code {
                      background: #f8f9fa;
                      border-radius: 6px;
                      padding: 20px;
                      margin: 20px 0;
                      text-align: center;
                      border: 2px solid #e74c3c;
                  }
                  .reset-code h2 {
                      color: #e74c3c;
                      font-size: 32px;
                      letter-spacing: 5px;
                      margin: 0;
                  }
                  .security-notice {
                      background: #fdf2f2;
                      border-left: 4px solid #e74c3c;
                      padding: 15px;
                      margin: 20px 0;
                  }
                  .steps {
                      background: #f8f9fa;
                      padding: 20px;
                      border-radius: 6px;
                      margin: 20px 0;
                  }
                  .steps ol {
                      margin: 0;
                      padding-left: 20px;
                  }
                  .steps li {
                      margin-bottom: 10px;
                  }
                  .footer {
                      padding: 20px 30px;
                      background: #f8f9fa;
                      border-radius: 0 0 8px 8px;
                      color: #666;
                      font-size: 14px;
                      text-align: center;
                  }
                  .social-links {
                      margin: 20px 0;
                  }
                  .social-links a {
                      margin: 0 10px;
                      color: #1a2634;
                      text-decoration: none;
                      font-weight: bold;
                  }
                  .divider {
                      height: 1px;
                      background-color: #e0e0e0;
                      margin: 20px 0;
                  }
                  .expiry-notice {
                      font-size: 13px;
                      color: #666;
                      font-style: italic;
                      text-align: center;
                      margin-top: 10px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Soul Gate</h1>
                  </div>
                  <div class="content">
                      <h2>Solicitud de restablecimiento de contraseña</h2>
                      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta Soul Gate. Si no realizaste esta solicitud, por favor ignora este correo.</p>
                      
                      <div class="reset-code">
                          <p>Tu código de restablecimiento es:</p>
                          <h2>${code}</h2>
                          <p class="expiry-notice">Este código expirará en 30 minutos por seguridad</p>
                      </div>
  
                      <div class="steps">
                          <h3>Pasos para restablecer tu contraseña:</h3>
                          <ol>
                              <li>Ingresa el código de restablecimiento mostrado arriba</li>
                              <li>Crea una nueva contraseña segura</li>
                              <li>Confirma tu nueva contraseña</li>
                          </ol>
                      </div>
  
                      <div class="security-notice">
                          <strong>⚠️ Aviso de seguridad:</strong>
                          <p>Por tu seguridad, te recomendamos:</p>
                          <ul>
                              <li>Usar una contraseña única que no uses en otros sitios</li>
                              <li>Incluir letras mayúsculas, minúsculas, números y símbolos</li>
                              <li>No compartir este código con nadie</li>
                          </ul>
                      </div>
                  </div>
                  
                  <div class="footer">
                      <div class="social-links">
                          <a href="#">Facebook</a>
                          <a href="#">Twitter</a>
                          <a href="#">Instagram</a>
                          <a href="#">LinkedIn</a>
                      </div>
                      <p>© ${currentYear} Soul Gate. Todos los derechos reservados.</p>
                      <p>
                          Si no solicitaste este restablecimiento de contraseña, 
                          por favor <a href="[CONTACT_SUPPORT_URL]" style="color: #e74c3c;">contacta a soporte</a> inmediatamente.
                      </p>
                  </div>
              </div>
          </body>
          </html>
      `;
  
      try {
          await transporter.sendMail({
              from: config.emailService.user,
              to: email,
              subject: 'Restablece tu contraseña - Soul Gate',
              html: html
          });
      } catch (error) {
          console.error('Error sending password reset email:', error);
          throw new Error('Failed to send password reset email');
      }
  };