const User = require('../models/Usuario');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Private (Solo Admin Nacional puede crear usuarios Admin IES y Operativos)
exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, secondLastName, email, password, role, ies, phone } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'El email ya está registrado'
    });
  }

  // Validar permisos para crear usuarios
  if (req.user) {
    // Si quien crea es Admin Nacional
    if (req.user.role === 'Admin Nacional') {
      // Puede crear cualquier tipo de usuario
      if (['Admin IES', 'Operativo IES'].includes(role) && !ies) {
        return res.status(400).json({
          success: false,
          message: 'Debes especificar la IES para este tipo de usuario'
        });
      }
    } 
    // Si quien crea es Admin IES
    else if (req.user.role === 'Admin IES') {
      // Solo puede crear Operativos de su misma IES
      if (role !== 'Operativo IES') {
        return res.status(403).json({
          success: false,
          message: 'Solo puedes crear usuarios Operativos de tu IES'
        });
      }
      if (!ies || ies.toString() !== req.user.ies.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Solo puedes crear operativos para tu IES'
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para crear usuarios'
      });
    }
  }

  // Crear usuario
  const user = await User.create({
    firstName,
    lastName,
    secondLastName,
    email,
    password,
    role,
    ies,
    phone
  });

  res.status(201).json({
    success: true,
    data: user.getPublicData(),
    token: generateToken(user._id)
  });
});

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar email y password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Por favor proporciona email y contraseña'
    });
  }

  // Buscar usuario por email e incluir password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Verificar si la cuenta está bloqueada
  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    return res.status(423).json({
      success: false,
      message: 'Cuenta bloqueada temporalmente. Intenta más tarde.'
    });
  }

  // Verificar password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Incrementar intentos fallidos
    user.failedAttempts += 1;

    // Bloquear después de 5 intentos fallidos
    if (user.failedAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      await user.save({ validateBeforeSave: false });

      return res.status(423).json({
        success: false,
        message: 'Cuenta bloqueada por múltiples intentos fallidos. Intenta en 30 minutos.'
      });
    }

    await user.save({ validateBeforeSave: false });

    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Login exitoso - resetear intentos fallidos
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  user.lastAccess = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user.getPublicData(),
    token: generateToken(user._id)
  });
});

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('ies', 'name code');

  res.status(200).json({
    success: true,
    data: user.getPublicData()
  });
});

// @desc    Actualizar contraseña
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Proporciona la contraseña actual y la nueva'
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  // Verificar contraseña actual
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Contraseña actual incorrecta'
    });
  }

  // Actualizar contraseña
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Contraseña actualizada correctamente',
    token: generateToken(user._id)
  });
});
