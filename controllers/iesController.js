const IES = require('../models/IES');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtener todas las IES
// @route   GET /api/ies
// @access  Private
exports.getAllIES = asyncHandler(async (req, res) => {
  let query = IES.find();

  // Si es Admin IES u Operativo, solo puede ver su IES
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    query = query.where('_id').equals(req.user.ies);
  }

  // Filtros opcionales
  if (req.query.state) {
    query = query.where('address.state').equals(req.query.state);
  }

  if (req.query.active !== undefined) {
    query = query.where('active').equals(req.query.active === 'true');
  }

  const ies = await query.sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: ies.length,
    data: ies
  });
});

// @desc    Obtener una IES por ID
// @route   GET /api/ies/:id
// @access  Private
exports.getIESById = asyncHandler(async (req, res) => {
  const ies = await IES.findById(req.params.id);

  if (!ies) {
    return res.status(404).json({
      success: false,
      message: 'IES no encontrada'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== ies._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta IES'
      });
    }
  }

  res.status(200).json({
    success: true,
    data: ies
  });
});

// @desc    Crear nueva IES
// @route   POST /api/ies
// @access  Private (Solo Admin Nacional)
exports.createIES = asyncHandler(async (req, res) => {
  const ies = await IES.create(req.body);

  res.status(201).json({
    success: true,
    data: ies
  });
});

// @desc    Actualizar IES
// @route   PUT /api/ies/:id
// @access  Private (Admin Nacional o Admin IES de esa IES)
exports.updateIES = asyncHandler(async (req, res) => {
  let ies = await IES.findById(req.params.id);

  if (!ies) {
    return res.status(404).json({
      success: false,
      message: 'IES no encontrada'
    });
  }

  // Verificar permisos
  if (req.user.role === 'Admin IES') {
    if (req.user.ies.toString() !== ies._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta IES'
      });
    }

    // Admin IES no puede cambiar ciertos campos críticos
    delete req.body.code;
    delete req.body.active;
  }

  ies = await IES.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: ies
  });
});

// @desc    Eliminar (desactivar) IES
// @route   DELETE /api/ies/:id
// @access  Private (Solo Admin Nacional)
exports.deleteIES = asyncHandler(async (req, res) => {
  const ies = await IES.findById(req.params.id);

  if (!ies) {
    return res.status(404).json({
      success: false,
      message: 'IES no encontrada'
    });
  }

  // En lugar de eliminar, desactivamos
  ies.active = false;
  await ies.save();

  res.status(200).json({
    success: true,
    message: 'IES desactivada correctamente',
    data: {}
  });
});

// @desc    Obtener carreras de una IES
// @route   GET /api/ies/:id/careers
// @access  Public
exports.getIESCareers = asyncHandler(async (req, res) => {
  const ies = await IES.findById(req.params.id).select('name careers');

  if (!ies) {
    return res.status(404).json({
      success: false,
      message: 'IES no encontrada'
    });
  }

  // Filtrar solo carreras activas
  const activeCareers = ies.careers.filter(career => career.active);

  res.status(200).json({
    success: true,
    data: {
      iesName: ies.name,
      careers: activeCareers
    }
  });
});
