const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  // Log para debug en producción
  console.log("🔍 Headers:", req.headers);
  console.log("🍪 Cookies:", req.cookies);

  // Primero intentar obtener token de cookies (httpOnly)
  if (req.cookies && req.cookies.anuies_token) {
    token = req.cookies.anuies_token;
    console.log("✅ Token obtenido de cookie");
  }
  // Si no está en cookies, verificar headers (para compatibilidad temporal)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("✅ Token obtenido de header");
  }

  // Verificar que el token existe
  if (!token) {
    console.log("❌ No se encontró token");
    return res.status(401).json({
      success: false,
      message: "No estás autorizado para acceder a esta ruta",
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("User typeof:", typeof User);
    console.log("User keys:", Object.keys(User));

    // Buscar el usuario por ID y poblar role e ies
    req.user = await User.findById(decoded.id)
      .select("-password")
      .populate("role")
      .populate("ies", "name code");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar si el usuario está activo
    if (!req.user.active) {
      return res.status(401).json({
        success: false,
        message: "Tu cuenta ha sido desactivada",
      });
    }

    // Actualizar último acceso
    req.user.lastAccess = new Date();
    await req.user.save({ validateBeforeSave: false });

    next();
  } catch (error) {
    console.error("❌ JWT VERIFY ERROR:", error.message);
    console.error("❌ SERVER TIME:", new Date());

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
