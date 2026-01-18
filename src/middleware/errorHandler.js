// Middleware para manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error para desarrollo
  console.error(err);

  // Error de Mongoose - ID inválido
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { message, statusCode: 404 };
  }

  // Error de Mongoose - Validación duplicada
  if (err.code === 11000) {
    const message = 'Recurso duplicado';
    error = { message, statusCode: 400 };
  }

  // Error de Mongoose - Validación
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

