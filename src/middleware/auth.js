const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  // Log para debug en producción
  console.log("🔍 [AUTH] Headers:", req.headers);
  console.log("🍪 [AUTH] Cookies:", req.cookies);
  console.log("🌐 [AUTH] Origin:", req.headers.origin);
  console.log("📍 [AUTH] URL:", req.url);

  // Primero intentar obtener token de cookies (httpOnly)
  if (req.cookies && req.cookies.anuies_token) {
    token = req.cookies.anuies_token;
    console.log("✅ [AUTH] Token obtenido de cookie");
  }
  // Si no está en cookies, verificar headers (para compatibilidad temporal)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("✅ [AUTH] Token obtenido de header");
  }

  // Verificar que el token existe
  if (!token) {
    console.log("❌ [AUTH] No se encontró token");
    return res.status(401).json({
      success: false,
      message: "No estás autorizado para acceder a esta ruta",
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ [AUTH] Token decodificado, userId:", decoded.id);

    // Buscar el usuario por ID y poblar role e ies
    req.user = await User.findById(decoded.id)
      .select("-password")
      .populate("role")
      .populate("ies", "name code");

    if (!req.user) {
      console.log("❌ [AUTH] Usuario no encontrado en BD");
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    console.log("✅ [AUTH] Usuario encontrado:", req.user.email, "Rol:", req.user.role?.name);

    // Verificar si el usuario está activo
    if (!req.user.active) {
      console.log("❌ [AUTH] Usuario inactivo");
      return res.status(401).json({
        success: false,
        message: "Tu cuenta ha sido desactivada",
      });
    }

    // Actualizar último acceso
    req.user.lastAccess = new Date();
    await req.user.save({ validateBeforeSave: false });

    console.log("✅ [AUTH] Middleware completado exitosamente");
    next();
  } catch (error) {
    console.error("❌ [AUTH] JWT VERIFY ERROR:", error.message);
    console.error("❌ [AUTH] SERVER TIME:", new Date());

    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

// Middleware para autorizar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Obtener el nombre del rol del usuario
    const userRoleName = req.user.role?.name || req.user.role;

    if (!roles.includes(userRoleName)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${userRoleName} no tiene permiso para realizar esta acción`,
      });
    }
    next();
  };
};

// Middleware para verificar que el usuario pertenece a una IES
exports.checkIESOwnership = (req, res, next) => {
  const iesId = req.params.iesId || req.body.ies;

  // Obtener el nombre del rol del usuario
  const userRoleName = req.user.role?.name || req.user.role;

  // Admin Nacional puede acceder a cualquier IES
  if (userRoleName === "Admin Nacional") {
    return next();
  }

  // Verificar que el usuario pertenece a la IES que intenta modificar
  if (req.user.ies && req.user.ies.toString() !== iesId) {
    return res.status(403).json({
      success: false,
      message: "No tienes permiso para acceder a esta IES",
    });
  }

  next();
};

// Middleware opcional: Si hay token, lo procesa, si no, deja pasar
exports.optionalProtect = async (req, res, next) => {
  let token;

  // Log para debug
  // console.log("🔍 Headers (Optional):", req.headers);

  if (req.cookies && req.cookies.anuies_token) {
    token = req.cookies.anuies_token;
  }
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id)
      .select("-password")
      .populate("role")
      .populate("ies", "name code");

    // Si el usuario no existe o está inactivo, lo tratamos como público/guest
    if (!req.user || !req.user.active) {
      req.user = null;
    } else {
      // Update access time for logged in users
      req.user.lastAccess = new Date();
      await req.user.save({ validateBeforeSave: false });
    }
  } catch (error) {
    // Si falla el token (expirado, inválido), simplemente continuamos como guest
    // console.log("⚠️ Token error in optionalProtect:", error.message);
    req.user = null;
  }

  next();
};
