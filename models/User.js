const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  apellidoPaterno: {
    type: String,
    required: [true, 'El apellido paterno es requerido'],
    trim: true
  },
  apellidoMaterno: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No devolver password por defecto en queries
  },
  rol: {
    type: String,
    enum: {
      values: ['Admin Nacional', 'Admin IES', 'Operativo IES', 'Interesado'],
      message: '{VALUE} no es un rol válido'
    },
    required: [true, 'El rol es requerido']
  },
  ies: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IES',
    // Solo requerido para roles de IES
    required: function() {
      return ['Admin IES', 'Operativo IES'].includes(this.rol);
    }
  },
  telefono: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date
  },
  intentosFallidos: {
    type: Number,
    default: 0
  },
  bloqueadoHasta: {
    type: Date
  }
}, {
  timestamps: true
});

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si el password fue modificado
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    secondLastName: this.secondLastName,
    email: this.email,
    role: this.role,
    ies: this.ies,
    phone: this.phone,
    active: this.active,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
