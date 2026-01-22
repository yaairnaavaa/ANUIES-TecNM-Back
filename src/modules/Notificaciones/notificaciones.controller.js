const asyncHandler = require("./../../middleware/asyncHandler");

class NotificacionesService {
  constructor(notificacionesService) {
    this.notificacionesService = notificacionesService;
  }

  sendEmail = asyncHandler(async (req, res) => {
    await this.notificacionesService.sendEmail();

    res.status(200).json({
      status: "success",
      message: "Email enviado ",
    });
  });
}

module.exports = NotificacionesService;
