const IEMS = require('../models/IEMS');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtener todas las IEMS
// @route   GET /api/iems
// @access  Private
exports.getAllIEMS = asyncHandler(async (req, res) => {
  let query = IEMS.find();

  // Filtros opcionales
  if (req.query.state) {
    query = query.where('address.state').equals(req.query.state);
  }

  if (req.query.municipality) {
    query = query.where('address.municipality').regex(new RegExp(req.query.municipality, 'i'));
  }

  if (req.query.type) {
    query = query.where('type').equals(req.query.type);
  }

  if (req.query.active !== undefined) {
    query = query.where('active').equals(req.query.active === 'true');
  }

  const iems = await query.sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: iems.length,
    data: iems
  });
});

// @desc    Obtener una IEMS por ID
// @route   GET /api/iems/:id
// @access  Private
exports.getIEMSById = asyncHandler(async (req, res) => {
  const iems = await IEMS.findById(req.params.id)
    .populate('linkage.directPassAgreements.ies', 'name code');

  if (!iems) {
    return res.status(404).json({
      success: false,
      message: 'IEMS no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: iems
  });
});

// @desc    Crear nueva IEMS
// @route   POST /api/iems
// @access  Private (Admin Nacional y Admin IES)
exports.createIEMS = asyncHandler(async (req, res) => {
  const iems = await IEMS.create(req.body);

  res.status(201).json({
    success: true,
    data: iems
  });
});

// @desc    Actualizar IEMS
// @route   PUT /api/iems/:id
// @access  Private (Admin Nacional y Admin IES)
exports.updateIEMS = asyncHandler(async (req, res) => {
  let iems = await IEMS.findById(req.params.id);

  if (!iems) {
    return res.status(404).json({
      success: false,
      message: 'IEMS no encontrada'
    });
  }

  iems = await IEMS.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: iems
  });
});

// @desc    Eliminar (desactivar) IEMS
// @route   DELETE /api/iems/:id
// @access  Private (Admin Nacional)
exports.deleteIEMS = asyncHandler(async (req, res) => {
  const iems = await IEMS.findById(req.params.id);

  if (!iems) {
    return res.status(404).json({
      success: false,
      message: 'IEMS no encontrada'
    });
  }

  // Desactivar en lugar de eliminar
  iems.active = false;
  await iems.save();

  res.status(200).json({
    success: true,
    message: 'IEMS desactivada correctamente',
    data: {}
  });
});

// @desc    Buscar IEMS por estado y municipio
// @route   GET /api/iems/search
// @access  Public
exports.searchIEMS = asyncHandler(async (req, res) => {
  const { state, municipality, type } = req.query;

  let query = IEMS.find({ active: true });

  if (state) {
    query = query.where('address.state').equals(state);
  }

  if (municipality) {
    query = query.where('address.municipality').regex(new RegExp(municipality, 'i'));
  }

  if (type) {
    query = query.where('type').equals(type);
  }

  const iems = await query.select('name type address.municipality address.state contact.email');

  res.status(200).json({
    success: true,
    count: iems.length,
    data: iems
  });
});
