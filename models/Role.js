const mongoose = require('mongoose');

// Esquema para Roles del sistema
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del rol es requerido'],
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: [true, 'El nombre para mostrar es requerido'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  scope: {
    type: String,
    enum: ['Nacional', 'IES', 'IEMS', 'General'],
    required: true
  },
  requiresIES: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
roleSchema.index({ active: 1 });
roleSchema.index({ level: 1 });

// Método para obtener permisos del rol
roleSchema.methods.getPermissions = async function() {
  await this.populate('permissions');
  return this.permissions.filter(p => p.active).map(p => p.name);
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
