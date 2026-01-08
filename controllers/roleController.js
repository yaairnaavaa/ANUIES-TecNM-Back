const Role = require('../models/Role');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtener todos los roles
// @route   GET /api/roles
// @access  Private (Solo Admin Nacional)
exports.getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find()
    .populate('permissions', 'name displayName module action')
    .sort({ level: 1 });

  res.status(200).json({
    success: true,
    count: roles.length,
    data: roles
  });
});

// @desc    Obtener un rol por ID
// @route   GET /api/roles/:id
// @access  Private (Solo Admin Nacional)
exports.getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id)
    .populate('permissions', 'name displayName module action resource');

  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Rol no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: role
  });
});

// @desc    Crear un nuevo rol
// @route   POST /api/roles
// @access  Private (Solo Admin Nacional)
exports.createRole = asyncHandler(async (req, res) => {
  const role = await Role.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Rol creado exitosamente',
    data: role
  });
});

// @desc    Actualizar un rol
// @route   PUT /api/roles/:id
// @access  Private (Solo Admin Nacional)
exports.updateRole = asyncHandler(async (req, res) => {
  let role = await Role.findById(req.params.id);

  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Rol no encontrado'
    });
  }

  role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Rol actualizado exitosamente',
    data: role
  });
});

// @desc    Eliminar un rol
// @route   DELETE /api/roles/:id
// @access  Private (Solo Admin Nacional)
exports.deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Rol no encontrado'
    });
  }

  await role.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Rol eliminado exitosamente'
  });
});
