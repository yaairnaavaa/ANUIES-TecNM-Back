const asyncHandler = require("./../../middleware/asyncHandler");

class NotificacionesController {
  constructor(notificacionesService) {
    this.notificacionesService = notificacionesService;
  }

  /**
   * Enviar correo electrónico de campaña al prospecto
   * POST /api/notifications/emailCampaign
   */
  sendEmailCampaign = asyncHandler(async (req, res) => {
    const { 
      prospectId, 
      fullName, 
      email, 
      campaignId,
      campaignName,
      iesName, 
      firstChoice, 
      folio 
    } = req.body;

    // Validar datos requeridos
    if (!prospectId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "El ID del prospecto, nombre completo y correo electrónico son obligatorios"
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "El formato del correo electrónico no es válido"
      });
    }

    try {
      // Enviar el correo a través del servicio
      const result = await this.notificacionesService.sendEmailRegisterCampaign({
        prospectId,
        fullName,
        email,
        campaignId,
        campaignName: campaignName || 'Campaña de Registro',
        iesName: iesName || 'Institución de Educación Superior',
        firstChoice: firstChoice || 'N/A',
        folio: folio || 'N/A'
      });

      res.status(200).json({
        success: true,
        message: "Correo enviado exitosamente",
        data: {
          recipient: email,
          messageId: result.messageId
        }
      });

    } catch (error) {
      console.error('❌ Error en sendEmailCampaign:', error);
      
      res.status(500).json({
        success: false,
        message: error.message || "Error al enviar el correo electrónico",
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  });
}

module.exports = NotificacionesController;
