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
        
        // Cargar la plantilla HTML
        this.emailTemplate = this.loadEmailTemplate();
    }
    
    /**
     * Cargar la plantilla HTML desde el archivo
     */
    loadEmailTemplate() {
        try {
            const templatePath = path.join(__dirname, 'templates', 'email-campaign.html');
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
            const registrationLink = `https://anuies-front.vercel.app/registerStudent/${prospectId}`;
            
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
     * Renderizar la plantilla HTML reemplazando las variables
     */
    renderEmailTemplate({ fullName, campaignName, iesName, firstChoice, folio, registrationLink }) {
        // Reemplazar las variables en la plantilla
        return this.emailTemplate
            .replace(/\{\{fullName\}\}/g, fullName)
            .replace(/\{\{campaignName\}\}/g, campaignName)
            .replace(/\{\{iesName\}\}/g, iesName)
            .replace(/\{\{firstChoice\}\}/g, firstChoice)
            .replace(/\{\{folio\}\}/g, folio)
            .replace(/\{\{registrationLink\}\}/g, registrationLink)
            .replace(/\{\{currentYear\}\}/g, new Date().getFullYear());
    }

}

module.exports = NotificacionesService;
