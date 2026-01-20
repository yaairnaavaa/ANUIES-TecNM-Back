const User = require("./../models/User");
const generateToken = require("./../utils/generateToken");
const asyncHandler = require("./../src/middleware/asyncHandler");

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/auth/register
 * @access  Private
 */
exports.register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    secondLastName,
    email,
    password,
    role, // ObjectId del Role
    ies,
    phone,
  } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "El email ya está registrado",
    });
  }

  // Validación de permisos según rol del usuario autenticado
  if (req.user) {
    const creatorRoleName = req.user.role.name;

    // Admin Nacional
    if (creatorRoleName === "Admin Nacional") {
      if (req.user.role.requiresIES && !ies) {
        return res.status(400).json({
          success: false,
          message: "Debes especificar la IES para este tipo de usuario",
        });
      }
    }
    // Admin IES
    else if (creatorRoleName === "Admin IES") {
      // Solo puede crear usuarios dentro de su IES
      if (!ies || ies.toString() !== req.user.ies.toString()) {
        return res.status(403).json({
          success: false,
          message: "Solo puedes crear usuarios para tu IES",
        });
      }
    }
    // Otros roles
    else {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para crear usuarios",
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
    role, // ObjectId del rol
    ies,
    phone,
  });

  // Volver a cargar con rol y permisos
  const populatedUser = await User.findById(user._id)
    .populate({
      path: "role",
      populate: {
        path: "permissions",
        match: { active: true },
      },
    })
    .populate("ies", "name code");

  const token = generateToken(user._id);

  // Configurar cookie con el token (httpOnly para seguridad)
  res.cookie("anuies_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  res.status(201).json({
    success: true,
    data: populatedUser.getPublicData(),
  });
});

/**
 * @desc    Login de usuario
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Por favor proporciona email y contraseña",
    });
  }

  const user = await User.findOne({ email })
    .select("+password")
    .populate({
      path: "role",
      populate: {
        path: "permissions",
        match: { active: true },
      },
    })
    .populate("ies", "name code");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Credenciales inválidas",
    });
  }

  // Cuenta bloqueada
  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    return res.status(423).json({
      success: false,
      message: "Cuenta bloqueada temporalmente. Intenta más tarde.",
    });
  }

  // Verificar password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.failedAttempts += 1;

    if (user.failedAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      return res.status(423).json({
        success: false,
        message:
          "Cuenta bloqueada por múltiples intentos fallidos. Intenta en 30 minutos.",
      });
    }

    await user.save({ validateBeforeSave: false });

    return res.status(401).json({
      success: false,
      message: "Credenciales inválidas",
    });
  }

  // Login exitoso
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  user.lastAccess = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  // Configurar cookie con el token (httpOnly para seguridad)
  res.cookie("anuies_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  res.status(200).json({
    success: true,
    data: user.getPublicData(),
  });
});

/**
 * @desc    Obtener usuario actual
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: "role",
      populate: {
        path: "permissions",
        match: { active: true },
      },
    })
    .populate("ies", "name code");

  res.status(200).json({
    success: true,
    data: user.getPublicData(),
  });
});

/**
 * @desc    Actualizar contraseña
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Proporciona la contraseña actual y la nueva",
    });
  }

  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Contraseña actual incorrecta",
    });
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);

  // Configurar cookie con el token (httpOnly para seguridad)
  res.cookie("anuies_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  res.status(200).json({
    success: true,
    message: "Contraseña actualizada correctamente",
  });
});

/**
 * @desc    Cerrar sesión
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  // Limpiar la cookie del token
  res.cookie("anuies_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Sesión cerrada correctamente",
  });
});
