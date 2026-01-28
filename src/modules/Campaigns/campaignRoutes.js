const express = require("express");

const { protect, authorize } = require("./../../middleware/auth");

const { campaignController } = require("./../../../bootstrap");

const router = express.Router();

router
  .route("/")
  .get(protect, campaignController.getAllCampaigns)
  .post(protect, authorize("Admin Nacional"), campaignController.createCampaign);

router
  .route("/:id")
  .get(protect, campaignController.getCampaignById)
  .delete(protect, authorize("Admin Nacional"), campaignController.deactivateCampaign)
  .patch(protect, authorize("Admin Nacional"), campaignController.updateCampaign);

// Todas las rutas públicas
// router.get('/', getAllCampaigns);
// router.get('/:id', getCampaignById);
// router.post('/', createCampaign);
// router.put('/:id', updateCampaign);
// router.delete('/:id', deleteCampaign);
// router.put('/:id/results', updateCampaignResults);

module.exports = router;
