const Prospect = require('../models/Prospect');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Registrar nuevo interesado (público)
// @route   POST /api/prospects/register
// @access  Public
exports.registerProspect = asyncHandler(async (req, res) => {
  // Verificar si el email ya existe
  const existingProspect = await Prospect.findOne({ email: req.body.email });

  if (existingProspect) {
    return res.status(400).json({
      success: false,
      message: 'El email ya está registrado'
    });
  }

  const prospect = await Prospect.create(req.body);

  // Verificar si el registro está completo
  prospect.verifyRegistrationComplete();
  await prospect.save();

  res.status(201).json({
    success: true,
    message: 'Registro exitoso. Por favor completa tu perfil para continuar.',
    data: {
      id: prospect._id,
      email: prospect.email,
      fullName: prospect.fullName,
      classification: prospect.classification,
      registrationComplete: prospect.processStatus.registrationComplete
    }
  });
});

// @desc    Actualizar perfil de interesado
// @route   PUT /api/prospects/:id/profile
// @access  Public (con el ID del interesado)
exports.updateProspectProfile = asyncHandler(async (req, res) => {
  let prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: 'Interesado no encontrado'
    });
  }

  // Actualizar campos permitidos
  const allowedFields = [
    'firstName', 'lastName', 'secondLastName',
    'phone', 'address', 'iemsCareer', 'iemsAverage',
    'currentSemester', 'estimatedGraduationDate',
    'careerInterests', 'socialMedia', 'personalInterests'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      prospect[field] = req.body[field];
    }
  });

  // Verificar si el registro está completo
  prospect.verifyRegistrationComplete();
  
  // Promover clasificación si aplica
  prospect.promoteClassification();

  await prospect.save();

  res.status(200).json({
    success: true,
    message: 'Perfil actualizado correctamente',
    data: {
      id: prospect._id,
      fullName: prospect.fullName,
      classification: prospect.classification,
      registrationComplete: prospect.processStatus.registrationComplete
    }
  });
});

// @desc    Obtener todos los interesados
// @route   GET /api/prospects
// @access  Private (Admin y Operativos)
exports.getAllProspects = asyncHandler(async (req, res) => {
  let query = Prospect.find();

  // Filtrar por IES si el usuario es Admin IES u Operativo
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    query = query.where('firstChoiceIES').equals(req.user.ies);
  }

  // Filtros opcionales
  if (req.query.classification) {
    query = query.where('classification').equals(req.query.classification);
  }

  if (req.query.firstChoiceIES) {
    query = query.where('firstChoiceIES').equals(req.query.firstChoiceIES);
  }



  if (req.query.contactChannel) {
    query = query.where('contactChannel').equals(req.query.contactChannel);
  }

  if (req.query.active !== undefined) {
    query = query.where('active').equals(req.query.active === 'true');
  }

  const prospects = await query
    .populate('firstChoiceIES', 'name code')
    .populate('originIEMS', 'name code')
    .populate('originCampaign', 'name type')
    // .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: prospects.length,
    data: prospects
  });
});

// @desc    Obtener interesado por ID
// @route   GET /api/prospects/:id
// @access  Private
exports.getProspectById = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id)
    .populate('firstChoiceIES', 'name code careers contact')
    .populate('originIEMS', 'name code')
    .populate('originCampaign', 'name type specificModality')
    // .populate('assignedTo', 'firstName lastName email phone');

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: 'Interesado no encontrado'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este interesado'
      });
    }
  }

  res.status(200).json({
    success: true,
    data: prospect
  });
});

// @desc    Asignar interesado a operativo
// @route   PUT /api/prospects/:id/assign
// @access  Private (Admin IES y Operativo IES)
exports.assignProspect = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: 'Interesado no encontrado'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para asignar este interesado'
      });
    }
  }

  // prospect.assignedTo = req.body.assignedTo || req.user.id;
  await prospect.save();

  res.status(200).json({
    success: true,
    message: 'Interesado asignado correctamente',
    data: prospect
  });
});

// @desc    Actualizar observaciones de interesado
// @route   PUT /api/prospects/:id/observations
// @access  Private (Admin IES y Operativo IES)
exports.updateObservations = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: 'Interesado no encontrado'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este interesado'
      });
    }
  }

  prospect.observations = req.body.observations;
  await prospect.save();

  res.status(200).json({
    success: true,
    message: 'Observaciones actualizadas',
    data: prospect
  });
});

// @desc    Validar perfil de interesado
// @route   PUT /api/prospects/:id/validate
// @access  Private (Admin IES y Operativo IES)
exports.validateProspect = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: 'Interesado no encontrado'
    });
  }

  // Verificar permisos
  if (['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para validar este interesado'
      });
    }
  }

  prospect.processStatus.profileValidated = true;
  prospect.promoteClassification();
  await prospect.save();

  res.status(200).json({
    success: true,
    message: 'Perfil validado correctamente',
    data: {
      id: prospect._id,
      fullName: prospect.fullName,
      classification: prospect.classification,
      profileValidated: prospect.processStatus.profileValidated
    }
  });
});
