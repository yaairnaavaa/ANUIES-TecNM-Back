const { Router } = require("express");

const { notificacionesController } = require("./../../../bootstrap");
const { protect } = require("./../../middleware/auth");

const router = Router();

router.route("/emailCampaign").post(protect, notificacionesController.sendEmailCampaign);

module.exports = router;
