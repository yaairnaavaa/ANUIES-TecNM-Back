const { Router } = require("express");

const { notificacionesController } = require("./../../../bootstrap");
const { protect, authorize } = require("./../../middleware/auth");

const router = Router();

// Ruta protegida - solo usuarios autenticados pueden enviar emails de campañas
router.route("/emailCampaign").post(protect, authorize('Admin Nacional', 'Admin IES'), notificacionesController.sendEmailCampaign);

module.exports = router;
