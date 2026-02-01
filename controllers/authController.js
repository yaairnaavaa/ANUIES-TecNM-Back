const crypto = require("crypto");
const User = require("./../models/User");
const PasswordResetToken = require("./../models/PasswordResetToken");
const generateToken = require("./../utils/generateToken");
const asyncHandler = require("./../src/middleware/asyncHandler");
const NotificacionesService = require("./../src/modules/Notificaciones/notificaciones.service");

const notificationService = new NotificacionesService();

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
  // sameSite: 'none' permite cookies cross-origin (necesario para Vercel)
  res.cookie('anuies_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
  // sameSite: 'none' + secure necesarios en producción cuando front y API están en distintos dominios (ej. Vercel)
  res.cookie("anuies_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
  // sameSite: 'none' permite cookies cross-origin (necesario para Vercel)
  res.cookie('anuies_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  res.status(200).json({
    success: true,
    message: "Contraseña actualizada correctamente",
  });
});

/**
 * @desc    Solicitar restablecimiento de contraseña (envía correo con enlace)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Proporciona un correo electrónico",
    });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  // Por seguridad: siempre respondemos igual si el correo existe o no
  const successMessage =
    "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos. Revisa tu bandeja de entrada y spam.";

  if (!user) {
    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  }

  // Invalidar tokens previos no usados para este email
  await PasswordResetToken.updateMany(
    { email: user.email, used: false },
    { used: true }
  );

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await PasswordResetToken.create({
    email: user.email,
    token,
    expiresAt,
  });

  const frontUrl = process.env.ANUIES_FRONT_URL || "http://localhost:4200";
  const resetLink = `${frontUrl}/reset-password/${token}`;
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "";

  try {
    await notificationService.sendPasswordResetEmail(user.email, resetLink, userName);
  } catch (err) {
    console.error("Error enviando correo de restablecimiento:", err);
    await PasswordResetToken.deleteOne({ token });
    return res.status(500).json({
      success: false,
      message: "No se pudo enviar el correo. Intenta de nuevo más tarde.",
    });
  }

  res.status(200).json({
    success: true,
    message: successMessage,
  });
});

/**
 * @desc    Restablecer contraseña con token (desde el enlace del correo)
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Token y nueva contraseña (mínimo 6 caracteres) son requeridos",
    });
  }

  const resetRecord = await PasswordResetToken.findOne({
    token: token.trim(),
    used: false,
  });

  if (!resetRecord) {
    return res.status(400).json({
      success: false,
      message: "El enlace no es válido o ha expirado. Solicita uno nuevo.",
    });
  }

  if (resetRecord.expiresAt < new Date()) {
    await PasswordResetToken.updateOne({ _id: resetRecord._id }, { used: true });
    return res.status(400).json({
      success: false,
      message: "El enlace ha expirado. Solicita uno nuevo desde el login.",
    });
  }

  const user = await User.findOne({ email: resetRecord.email }).select("+password");
  if (!user) {
    await PasswordResetToken.updateOne({ _id: resetRecord._id }, { used: true });
    return res.status(400).json({
      success: false,
      message: "Usuario no encontrado.",
    });
  }

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.updateOne({ _id: resetRecord._id }, { used: true });

  res.status(200).json({
    success: true,
    message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
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
    secure: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Sesión cerrada correctamente",
  });
});
