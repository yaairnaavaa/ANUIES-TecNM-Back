const Mailjet = require('node-mailjet');
const fs = require('fs');
const path = require('path');

class NotificacionesService {
    constructor() {
        // Inicializar MailJet con las credenciales del .env
        this.mailjet = Mailjet.apiConnect(
            process.env.API_KEY,
            process.env.SECRET_KEY
        );

        // Cargar las plantillas HTML
        this.emailTemplate = this.loadEmailTemplate('email-campaign.html');
        this.resetPasswordTemplate = this.loadEmailTemplate('email-resetPassword.html');
        this.newUserTemplate = this.loadEmailTemplate('email-newUser.html');
    }

    /**
     * Cargar una plantilla HTML desde el archivo
     * @param {string} filename - Nombre del archivo en la carpeta templates
     */
    loadEmailTemplate(filename) {
        try {
            const templatePath = path.join(__dirname, 'templates', filename);
            return fs.readFileSync(templatePath, 'utf8');
        } catch (error) {
            console.error('❌ Error al cargar la plantilla HTML:', error);
            throw new Error('No se pudo cargar la plantilla del correo');
        }
    }

    /**
     * Enviar correo de campaña al prospecto
     * @param {Object} data - Datos del prospecto y la campaña
     */
    async sendEmailRegisterCampaign(data) {
        const { prospectId, fullName, email, campaignId, campaignName, iesName, firstChoice, folio } = data;

        try {
            // Construir la URL de registro con el ID del prospecto
            const registrationLink = `${process.env.ANUIES_FRONT_URL}/registerStudent/${prospectId}`;

            // Generar contenido HTML con los datos del prospecto
            const htmlContent = this.renderEmailTemplate({
                fullName,
                campaignName,
                iesName,
                firstChoice,
                folio,
                registrationLink
            });

            // Configuración del correo
            const request = this.mailjet
                .post('send', { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: process.env.MAILJET_FROM_EMAIL || 'no-replyanuies@ittepic.edu.mx',
                                Name: 'ANUIES - Asociación Nacional de Universidades'
                            },
                            To: [
                                {
                                    Email: email,
                                    Name: fullName
                                }
                            ],
                            Subject: '¡Bienvenido a ANUIES! - Confirmación de Registro',
                            HTMLPart: htmlContent
                        }
                    ]
                });

            const result = await request;

            console.log('✅ Correo enviado exitosamente:', result.body);

            return {
                success: true,
                message: 'Correo enviado exitosamente',
                messageId: result.body.Messages[0].Status
            };

        } catch (error) {
            console.error('❌ Error al enviar correo con MailJet:', error);

            throw new Error(
                error.statusCode
                    ? `Error de MailJet: ${error.message}`
                    : 'Error al enviar el correo electrónico'
            );
        }
    }

    /**
     * Enviar correo con enlace para restablecer contraseña
     * @param {string} email - Correo del usuario
     * @param {string} resetLink - URL con token para restablecer
     * @param {string} [userName] - Nombre del usuario (opcional)
     */
    async sendPasswordResetEmail(email, resetLink, userName = '') {
        try {
            const displayName = userName || email;
            const htmlContent = this.renderResetPasswordTemplate({
                displayName,
                resetLink,
                currentYear: new Date().getFullYear()
            });

            // Incluir el banner como imagen inline (CID) para que se vea en el correo sin depender de URL externa
            const bannerPath = path.join(__dirname, '..', '..', 'assets', 'anuies-banner.png');
            const bannerBase64 = fs.existsSync(bannerPath)
                ? fs.readFileSync(bannerPath, { encoding: 'base64' })
                : null;

            const messagePayload = {
                From: {
                    Email: process.env.MAILJET_FROM_EMAIL || 'no-replyanuies@ittepic.edu.mx',
                    Name: 'ANUIES - No responder'
                },
                To: [{ Email: email, Name: displayName }],
                Subject: 'Restablecer tu contraseña - ANUIES',
                HTMLPart: htmlContent
            };
            if (bannerBase64) {
                messagePayload.InlinedAttachments = [
                    {
                        ContentType: 'image/png',
                        Filename: 'anuies-banner.png',
                        ContentID: 'banner',
                        Base64Content: bannerBase64
                    }
                ];
            }

            const request = this.mailjet
                .post('send', { version: 'v3.1' })
                .request({
                    Messages: [messagePayload]
                });

            await request;
            return { success: true };
        } catch (error) {
            console.error('❌ Error al enviar correo de restablecimiento:', error);
            throw error;
        }
    }

    /**
     * Renderizar la plantilla HTML de campaña reemplazando las variables
     */
    renderEmailTemplate({ fullName, campaignName, iesName, firstChoice, folio, registrationLink }) {
        return this.emailTemplate
            .replace(/\{\{fullName\}\}/g, fullName)
            .replace(/\{\{campaignName\}\}/g, campaignName)
            .replace(/\{\{iesName\}\}/g, iesName)
            .replace(/\{\{firstChoice\}\}/g, firstChoice)
            .replace(/\{\{folio\}\}/g, folio)
            .replace(/\{\{registrationLink\}\}/g, registrationLink)
            .replace(/\{\{currentYear\}\}/g, new Date().getFullYear());
    }

    /**
     * Renderizar la plantilla HTML de restablecimiento de contraseña
     * @param {Object} data - { displayName, resetLink, currentYear }
     */
    renderResetPasswordTemplate({ displayName, resetLink, currentYear }) {
        return this.resetPasswordTemplate
            .replace(/\{\{displayName\}\}/g, displayName)
            .replace(/\{\{resetLink\}\}/g, resetLink)
            .replace(/\{\{currentYear\}\}/g, currentYear);
    }

    /**
     * Enviar correo con credenciales para nuevo usuario
     * @param {string} email - Correo del usuario
     * @param {string} password - Contraseña
     * @param {string} loginLink - URL para iniciar sesión
     * @param {string} [userName] - Nombre del usuario
     */
    async sendNewUserEmail(email, password, loginLink, userName = '') {
        try {
            const displayName = userName || email;
            const htmlContent = this.renderNewUserTemplate({
                displayName,
                email,
                password,
                loginLink,
                currentYear: new Date().getFullYear()
            });

            // Incluir el banner como imagen inline (CID)
            const bannerPath = path.join(__dirname, '..', '..', 'assets', 'anuies-banner.png');
            const bannerBase64 = fs.existsSync(bannerPath)
                ? fs.readFileSync(bannerPath, { encoding: 'base64' })
                : null;

            const messagePayload = {
                From: {
                    Email: process.env.MAILJET_FROM_EMAIL || 'no-replyanuies@ittepic.edu.mx',
                    Name: 'ANUIES - Accesos Provisionales'
                },
                To: [{ Email: email, Name: displayName }],
                Subject: 'Bienvenido a ANUIES - Tus Credenciales de Acceso',
                HTMLPart: htmlContent
            };

            if (bannerBase64) {
                messagePayload.InlinedAttachments = [
                    {
                        ContentType: 'image/png',
                        Filename: 'anuies-banner.png',
                        ContentID: 'banner',
                        Base64Content: bannerBase64
                    }
                ];
            }

            const request = this.mailjet
                .post('send', { version: 'v3.1' })
                .request({
                    Messages: [messagePayload]
                });

            await request;
            return { success: true };
        } catch (error) {
            console.error('❌ Error al enviar correo de nuevo usuario:', error);
            // No lanzamos error para no interrumpir el flujo de creación de usuario,
            // pero logueamos el error.
            return { success: false, error };
        }
    }

    /**
     * Renderizar la plantilla HTML de nuevo usuario
     */
    renderNewUserTemplate({ displayName, email, password, loginLink, currentYear }) {
        return this.newUserTemplate
            .replace(/\{\{displayName\}\}/g, displayName)
            .replace(/\{\{email\}\}/g, email)
            .replace(/\{\{password\}\}/g, password)
            .replace(/\{\{loginLink\}\}/g, loginLink)
            .replace(/\{\{currentYear\}\}/g, currentYear);
    }
}

module.exports = NotificacionesService;
