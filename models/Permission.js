const mongoose = require('mongoose');

// Esquema para Permisos del sistema
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del permiso es requerido'],
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  module: {
    type: String,
    enum: ['Usuarios', 'IES', 'IEMS', 'Campañas', 'Prospectos', 'Periodos', 'Reportes', 'Configuración', 'Sistema']
  },
  action: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'execute', 'export', 'import']
  },
  resource: {
    type: String,
    trim: true
  },
  conditions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
permissionSchema.index({ module: 1 });
permissionSchema.index({ active: 1 });
permissionSchema.index({ module: 1, action: 1 });

// Virtual para código del permiso
permissionSchema.virtual('code').get(function() {
  return `${this.module}.${this.resource}.${this.action}`;
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
