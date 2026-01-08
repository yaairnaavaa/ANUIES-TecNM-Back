const Campaign = require('../models/Campaign');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtener todas las campañas
// @route   GET /api/campaigns
// @access  Private
exports.getAllCampaigns = asyncHandler(async (req, res) => {
  let query = Campaign.find();

  // Si es Admin IES u Operativo, solo puede ver campañas de su IES
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    query = query.where('ies').equals(req.user.ies);
  }

  // Filtros opcionales
  if (req.query.ies) {
    query = query.where('ies').equals(req.query.ies);
  }

  if (req.query.type) {
    query = query.where('type').equals(req.query.type);
  }

  if (req.query.status) {
    query = query.where('status').equals(req.query.status);
  }

  const campaigns = await query
    .populate('ies', 'name code')
    .populate('targetedIEMS', 'name type address.municipality address.state')
    .populate('responsible', 'firstName lastName email')
    .sort({ 'period.startDate': -1 });

  res.status(200).json({
    success: true,
    count: campaigns.length,
    data: campaigns
  });
});

// @desc    Obtener una campaña por ID
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('ies', 'name code')
    .populate('targetedIEMS', 'name type address.municipality address.state')
    .populate('responsible', 'firstName lastName email');

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaña no encontrada'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== campaign.ies._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta campaña'
      });
    }
  }

  res.status(200).json({
    success: true,
    data: campaign
  });
});

// @desc    Crear nueva campaña
// @route   POST /api/campaigns
// @access  Private (Admin IES y Operativo IES)
exports.createCampaign = asyncHandler(async (req, res) => {
  // Asignar IES del usuario si no viene en el body
  if (!req.body.ies && req.user.ies) {
    req.body.ies = req.user.ies;
  }

  // Verificar que el usuario solo cree campañas de su IES
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.body.ies.toString() !== req.user.ies.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes crear campañas para tu IES'
      });
    }
  }

  // Asignar responsable
  req.body.responsible = req.user.id;

  const campaign = await Campaign.create(req.body);

  res.status(201).json({
    success: true,
    data: campaign
  });
});

// @desc    Actualizar campaña
// @route   PUT /api/campaigns/:id
// @access  Private (Admin IES y Operativo IES)
exports.updateCampaign = asyncHandler(async (req, res) => {
  let campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaña no encontrada'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== campaign.ies.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta campaña'
      });
    }
  }

  // No permitir cambiar la IES
  delete req.body.ies;

  campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: campaign
  });
});

// @desc    Eliminar campaña
// @route   DELETE /api/campaigns/:id
// @access  Private (Admin Nacional y Admin IES)
exports.deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaña no encontrada'
    });
  }

  // Verificar permisos
  if (req.user.role === 'Admin IES') {
    if (req.user.ies.toString() !== campaign.ies.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta campaña'
      });
    }
  }

  await campaign.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Campaña eliminada correctamente',
    data: {}
  });
});

// @desc    Actualizar resultados de campaña
// @route   PUT /api/campaigns/:id/results
// @access  Private (Admin IES y Operativo IES)
exports.updateCampaignResults = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaña no encontrada'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== campaign.ies.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta campaña'
      });
    }
  }

  // Actualizar solo campos de resultados
  if (req.body.reach) campaign.reach = { ...campaign.reach, ...req.body.reach };
  if (req.body.results) campaign.results = { ...campaign.results, ...req.body.results };

  await campaign.save();

  res.status(200).json({
    success: true,
    data: campaign
  });
});
