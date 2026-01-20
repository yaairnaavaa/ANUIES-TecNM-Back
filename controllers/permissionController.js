const Permission = require("./../models/Permission");
const asyncHandler = require("./../src/middleware/asyncHandler");

// @desc    Obtener todos los permisos
// @route   GET /api/permissions
// @access  Private (Solo Admin Nacional)
exports.getAllPermissions = asyncHandler(async (req, res) => {
  let query = Permission.find();

  // Filtrar por módulo si se proporciona
  if (req.query.module) {
    query = query.where("module").equals(req.query.module);
  }

  // Filtrar por acción si se proporciona
  if (req.query.action) {
    query = query.where("action").equals(req.query.action);
  }

  const permissions = await query.sort({ module: 1, resource: 1 });

  res.status(200).json({
    success: true,
    count: permissions.length,
    data: permissions,
  });
});

// @desc    Obtener un permiso por ID
// @route   GET /api/permissions/:id
// @access  Private (Solo Admin Nacional)
exports.getPermissionById = asyncHandler(async (req, res) => {
  const permission = await Permission.findById(req.params.id);

  if (!permission) {
    return res.status(404).json({
      success: false,
      message: "Permiso no encontrado",
    });
  }

  res.status(200).json({
    success: true,
    data: permission,
  });
});

// @desc    Crear un nuevo permiso
// @route   POST /api/permissions
// @access  Private (Solo Admin Nacional)
exports.createPermission = asyncHandler(async (req, res) => {
  const permission = await Permission.create(req.body);

  res.status(201).json({
    success: true,
    message: "Permiso creado exitosamente",
    data: permission,
  });
});

// @desc    Actualizar un permiso
// @route   PUT /api/permissions/:id
// @access  Private (Solo Admin Nacional)
exports.updatePermission = asyncHandler(async (req, res) => {
  let permission = await Permission.findById(req.params.id);

  if (!permission) {
    return res.status(404).json({
      success: false,
      message: "Permiso no encontrado",
    });
  }

  permission = await Permission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Permiso actualizado exitosamente",
    data: permission,
  });
});

// @desc    Eliminar un permiso
// @route   DELETE /api/permissions/:id
// @access  Private (Solo Admin Nacional)
exports.deletePermission = asyncHandler(async (req, res) => {
  const permission = await Permission.findById(req.params.id);

  if (!permission) {
    return res.status(404).json({
      success: false,
      message: "Permiso no encontrado",
    });
  }

  await permission.deleteOne();

  res.status(200).json({
    success: true,
    message: "Permiso eliminado exitosamente",
  });
});
