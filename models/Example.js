const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true, // Crea automáticamente createdAt y updatedAt
  versionKey: false // Elimina el campo __v
});

// Índices para mejorar el rendimiento de búsquedas
exampleSchema.index({ name: 1 });
exampleSchema.index({ status: 1 });

// Métodos del modelo (opcional)
exampleSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return obj;
};

const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;

