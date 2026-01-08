const mongoose = require('mongoose');

const prospectSchema = new mongoose.Schema({
  // Datos personales
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'El apellido paterno es requerido'],
    trim: true
  },
  secondLastName: {
    type: String,
    trim: true
  },
  
  // Datos de contacto
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  phone: {
    landline: String,
    mobile: {
      type: String,
      required: [true, 'El teléfono móvil es requerido']
    }
  },
  
  // Dirección
  address: {
    street: String,
    number: String,
    neighborhood: String,
    locality: String,
    municipality: String,
    state: String,
    postalCode: {
      type: String,
      required: true
    }
  },
  
  // Procedencia académica
  originIEMS: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IEMS',
    required: [true, 'La IEMS de procedencia es requerida']
  },
  iemsCareer: String,
  iemsAverage: Number,
  currentSemester: Number,
  estimatedGraduationDate: Date,
  
  // Interés en TecNM
  firstChoiceIES: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IES',
    required: [true, 'La IES de primera opción es requerida']
  },
  careerInterests: [{
    career: {
      type: String,
      required: true
    },
    priority: {
      type: Number,
      min: 1,
      max: 3
    }
  }],
  
  // Canal de captación
  contactChannel: {
    type: String,
    enum: [
      'Conferencia',
      'Visita a IEMS',
      'Facebook',
      'Instagram',
      'TikTok',
      'WhatsApp',
      'Feria universitaria',
      'Familiar o amigo',
      'Docente de IEMS',
      'Sitio web',
      'YouTube',
      'Open House',
      'Otro'
    ],
    required: true
  },
  originCampaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  
  // Clasificación del interés
  classification: {
    type: String,
    enum: {
      values: ['Curioso', 'Prospecto', 'Aspirante Activo'],
      message: '{VALUE} no es una clasificación válida'
    },
    default: 'Curioso'
  },
  
  // Redes sociales e intereses
  socialMedia: {
    facebook: String,
    instagram: String,
    tiktok: String,
    twitter: String
  },
  personalInterests: [String],
  
  // Estado del proceso
  processStatus: {
    registrationComplete: {
      type: Boolean,
      default: false
    },
    profileValidated: {
      type: Boolean,
      default: false
    },
    readNotifications: [{
      date: Date,
      message: String
    }],
    lastInteraction: Date
  },
  
  // Seguimiento
  observations: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
prospectSchema.index({ email: 1 });
prospectSchema.index({ originIEMS: 1 });
prospectSchema.index({ firstChoiceIES: 1 });
prospectSchema.index({ classification: 1 });
prospectSchema.index({ contactChannel: 1 });
prospectSchema.index({ active: 1 });

// Virtual para nombre completo
prospectSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName} ${this.secondLastName || ''}`.trim();
});

// Método para avanzar clasificación
prospectSchema.methods.promoteClassification = function() {
  if (this.classification === 'Curioso' && this.processStatus.registrationComplete) {
    this.classification = 'Prospecto';
  } else if (this.classification === 'Prospecto' && this.processStatus.profileValidated) {
    this.classification = 'Aspirante Activo';
  }
};

// Método para verificar si está completo el registro
prospectSchema.methods.verifyRegistrationComplete = function() {
  const requiredFields = [
    this.firstName,
    this.lastName,
    this.email,
    this.phone.mobile,
    this.address.postalCode,
    this.originIEMS,
    this.firstChoiceIES,
    this.careerInterests.length > 0
  ];
  
  this.processStatus.registrationComplete = requiredFields.every(field => !!field);
  return this.processStatus.registrationComplete;
};

// Pre-save hook
prospectSchema.pre('save', async function() {
  this.processStatus.lastInteraction = new Date();
});

module.exports = mongoose.model('Prospect', prospectSchema);
