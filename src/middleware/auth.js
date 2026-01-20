const jwt = require('jsonwebtoken');
const User = require('../modules/Users/User.model');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  // Primero intentar obtener token de cookies (httpOnly)
  if (req.cookies && req.cookies.anuies_token) {
    token = req.cookies.anuies_token;
  }
  // Si no está en cookies, verificar headers (para compatibilidad temporal)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar que el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No estás autorizado para acceder a esta ruta'
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario por ID
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario está activo
    if (!req.user.active) {
      return res.status(401).json({
        success: false,
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    // Actualizar último acceso
    req.user.lastAccess = new Date();
    await req.user.save({ validateBeforeSave: false });

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para autorizar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.role} no tiene permiso para realizar esta acción`
      });
    }
    next();
  };
};

// Middleware para verificar que el usuario pertenece a una IES
exports.checkIESOwnership = (req, res, next) => {
  const iesId = req.params.iesId || req.body.ies;

  // Admin Nacional puede acceder a cualquier IES
  if (req.user.role === 'Admin Nacional') {
    return next();
  }

  // Verificar que el usuario pertenece a la IES que intenta modificar
  if (req.user.ies && req.user.ies.toString() !== iesId) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permiso para acceder a esta IES'
    });
  }

  next();
};
