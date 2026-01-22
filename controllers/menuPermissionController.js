const MenuPermission = require('../models/MenuPermission');
const asyncHandler = require('./../src/middleware/asyncHandler');

// @desc    Obtener todos los permisos del menú
// @route   GET /api/menupermissions
// @access  Private
exports.getAllMenuPermissions = asyncHandler(async (req, res) => {
  const permissions = await MenuPermission.find()
    .sort({ category: 1, order: 1 });

  res.status(200).json({
    success: true,
    count: permissions.length,
    data: permissions
  });
});

// @desc    Obtener un permiso por ID
// @route   GET /api/menupermissions/:id
// @access  Private
exports.getMenuPermissionById = asyncHandler(async (req, res) => {
  const permission = await MenuPermission.findById(req.params.id);

  if (!permission) {
    return res.status(404).json({
      success: false,
      message: 'Permiso no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: permission
  });
});

// @desc    Crear un nuevo permiso
// @route   POST /api/menupermissions
// @access  Private (Solo Admin Nacional)
exports.createMenuPermission = asyncHandler(async (req, res) => {
  const permission = await MenuPermission.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Permiso creado exitosamente',
    data: permission
  });
});

// @desc    Actualizar un permiso
// @route   PUT /api/menupermissions/:id
// @access  Private (Solo Admin Nacional)
exports.updateMenuPermission = asyncHandler(async (req, res) => {
  let permission = await MenuPermission.findById(req.params.id);

  if (!permission) {
    return res.status(404).json({
      success: false,
      message: 'Permiso no encontrado'
    });
  }

  permission = await MenuPermission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Permiso actualizado exitosamente',
    data: permission
  });
});

// @desc    Eliminar un permiso
// @route   DELETE /api/menupermissions/:id
// @access  Private (Solo Admin Nacional)
exports.deleteMenuPermission = asyncHandler(async (req, res) => {
  const permission = await MenuPermission.findById(req.params.id);

  if (!permission) {
    return res.status(404).json({
      success: false,
      message: 'Permiso no encontrado'
    });
  }

  await permission.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Permiso eliminado exitosamente'
  });
});
