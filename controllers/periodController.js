const Period = require('../models/Period');
const asyncHandler = require('./../src/middleware/asyncHandler');

// @desc    Obtener todos los periodos
// @route   GET /api/periods
// @access  Private
exports.getAllPeriods = asyncHandler(async (req, res) => {
  let query = Period.find();

  // Filtrar por año académico si se proporciona
  if (req.query.academicYear) {
    query = query.where('academicYear').equals(req.query.academicYear);
  }

  // Filtrar por estado si se proporciona
  if (req.query.status) {
    query = query.where('status').equals(req.query.status);
  }

  const periods = await query.sort({ 'dates.classStart': -1 });

  res.status(200).json({
    success: true,
    count: periods.length,
    data: periods
  });
});

// @desc    Obtener el periodo actual
// @route   GET /api/periods/current
// @access  Private
exports.getCurrentPeriod = asyncHandler(async (req, res) => {
  const period = await Period.findOne({ isCurrent: true });

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'No hay periodo activo configurado'
    });
  }

  res.status(200).json({
    success: true,
    data: period
  });
});

// @desc    Obtener un periodo por ID
// @route   GET /api/periods/:id
// @access  Private
exports.getPeriodById = asyncHandler(async (req, res) => {
  const period = await Period.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Periodo no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: period
  });
});

// @desc    Crear un nuevo periodo
// @route   POST /api/periods
// @access  Private (Solo Admin Nacional)
exports.createPeriod = asyncHandler(async (req, res) => {
  const period = await Period.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Periodo creado exitosamente',
    data: period
  });
});

// @desc    Actualizar un periodo
// @route   PUT /api/periods/:id
// @access  Private (Solo Admin Nacional)
exports.updatePeriod = asyncHandler(async (req, res) => {
  let period = await Period.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Periodo no encontrado'
    });
  }

  period = await Period.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Periodo actualizado exitosamente',
    data: period
  });
});

// @desc    Eliminar un periodo
// @route   DELETE /api/periods/:id
// @access  Private (Solo Admin Nacional)
exports.deletePeriod = asyncHandler(async (req, res) => {
  const period = await Period.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Periodo no encontrado'
    });
  }

  await period.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Periodo eliminado exitosamente'
  });
});

// @desc    Activar un periodo como actual
// @route   PUT /api/periods/:id/activate
// @access  Private (Solo Admin Nacional)
exports.activatePeriod = asyncHandler(async (req, res) => {
  const period = await Period.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Periodo no encontrado'
    });
  }

  period.isCurrent = true;
  await period.save();

  res.status(200).json({
    success: true,
    message: 'Periodo activado como actual',
    data: period
  });
});

// @desc    Actualizar estadísticas del periodo
// @route   PUT /api/periods/:id/statistics
// @access  Private (Admin Nacional, Admin IES)
exports.updatePeriodStatistics = asyncHandler(async (req, res) => {
  const period = await Period.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Periodo no encontrado'
    });
  }

  // Actualizar estadísticas
  if (req.body.totalEnrolled !== undefined) {
    period.statistics.totalEnrolled = req.body.totalEnrolled;
  }
  if (req.body.newStudents !== undefined) {
    period.statistics.newStudents = req.body.newStudents;
  }
  if (req.body.totalProspects !== undefined) {
    period.statistics.totalProspects = req.body.totalProspects;
  }

  // Calcular tasa de conversión
  period.calculateConversionRate();

  await period.save();

  res.status(200).json({
    success: true,
    message: 'Estadísticas actualizadas exitosamente',
    data: period
  });
});
