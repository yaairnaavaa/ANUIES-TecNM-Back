const mongoose = require('mongoose');

const iesSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'La clave del Tecnológico es requerida'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'El nombre del Tecnológico es requerido'],
    trim: true
  },
  shortName: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    number: String,
    neighborhood: String,
    municipality: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: String,
    country: {
      type: String,
      default: 'México'
    }
  },
  contact: {
    generalPhone: String,
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      tiktok: String
    }
  },
  careers: [{
    name: {
      type: String,
      required: true
    },
    code: String,
    modality: {
      type: String,
      enum: ['Presencial', 'Mixta', 'Virtual'],
      default: 'Presencial'
    },
    duration: {
      type: Number, // En semestres
      default: 9
    },
    shift: [{
      type: String,
      enum: ['Matutino', 'Vespertino', 'Nocturno', 'Mixto']
    }],
    capacityPerSemester: {
      type: Number,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  }],
  institutionalImage: {
    logo: String, // URL del logo
    banner: String, // URL del banner
    gallery: [String] // URLs de imágenes del campus
  },
  configuration: {
    enrollmentPeriod: {
      start: Date,
      end: Date
    },
    requiresEntranceExam: {
      type: Boolean,
      default: true
    },
    acceptsDirectPass: {
      type: Boolean,
      default: false
    }
  },
  statistics: {
    totalEnrollment: Number,
    newEnrollmentLastPeriod: Number,
    firstSemesterDropoutRate: Number,
    lastUpdate: Date
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas frecuentes
iesSchema.index({ state: 1 });
iesSchema.index({ 'careers.name': 1 });
iesSchema.index({ active: 1 });

// Virtual para nombre completo
iesSchema.virtual('fullName').get(function() {
  return this.shortName || this.name;
});

// Método para obtener capacidad total
iesSchema.methods.getTotalCapacity = function() {
  return this.careers.reduce((total, career) => {
    return total + (career.active ? career.capacityPerSemester : 0);
  }, 0);
};

module.exports = mongoose.model('IES', iesSchema);
