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

// Todas las rutas están protegidas
router.use(protect);

router.route('/')
  .get(getAllCampaigns)
  .post(authorize('Admin Nacional', 'Admin IES', 'Operativo IES'), createCampaign);

router.route('/:id')
  .get(getCampaignById)
  .put(authorize('Admin Nacional', 'Admin IES', 'Operativo IES'), updateCampaign)
  .delete(authorize('Admin Nacional', 'Admin IES'), deleteCampaign);

router.put(
  '/:id/results',
  authorize('Admin Nacional', 'Admin IES', 'Operativo IES'),
  updateCampaignResults
);

module.exports = router;
