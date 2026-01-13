const express = require('express');
const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  updateCampaignResults
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas públicas
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
router.put('/:id/results', updateCampaignResults);

module.exports = router;
