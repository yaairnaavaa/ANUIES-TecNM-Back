const express = require("express");

const { protect, authorize } = require("./../../middleware/auth");

const { campaignController } = require("./../../../bootstrap");

const router = express.Router();

router.route("/").get(campaignController.getAllCampaigns);

router
  .route("/:id")
  .get(campaignController.getCampaignById)
  .delete(campaignController.deactivateCampaign)
  .patch(campaignController.updateCampaign);

// Todas las rutas públicas
// router.get('/', getAllCampaigns);
// router.get('/:id', getCampaignById);
// router.post('/', createCampaign);
// router.put('/:id', updateCampaign);
// router.delete('/:id', deleteCampaign);
// router.put('/:id/results', updateCampaignResults);

module.exports = router;
