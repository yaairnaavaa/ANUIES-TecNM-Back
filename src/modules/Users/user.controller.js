const asyncHandler = require("../../middleware/asyncHandler");

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // @desc    Obtener todos los usuarios (con filtros opcionales)
  // @route   GET /api/users
  // @access  Private
  getAllUsers = asyncHandler(async (req, res) => {
    const queryObject = {};
    
    // Permitir filtrado por IES
    if (req.query.ies) {
      queryObject.ies = req.query.ies;
    }
    
    // Permitir filtrado por estado activo
    if (req.query.active !== undefined) {
      queryObject.active = req.query.active === 'true';
    }
    
    const users = await this.userService.getUsers(queryObject);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  });

  // @desc    Obtener usuario por ID
  // @route   GET /api/users/:id
  // @access  Private
  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await this.userService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  // @desc    Crear nuevo usuario
  // @route   POST /api/users
  // @access  Private (Admin Nacional o Admin IES)
  createUser = asyncHandler(async (req, res) => {
    const data = req.body;

    const createdUser = await this.userService.createUser(data);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: createdUser,
    });
  });

  // @desc    Actualizar usuario
  // @route   PATCH /api/users/:id
  // @access  Private (Admin Nacional o Admin IES de esa IES)
  updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const updatedUser = await this.userService.updateUser(id, data);

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    });
  });

  // @desc    Desactivar usuario
  // @route   DELETE /api/users/:id
  // @access  Private (Admin Nacional o Admin IES)
  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await this.userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'Usuario desactivado correctamente',
    });
  });
}

module.exports = UserController;
