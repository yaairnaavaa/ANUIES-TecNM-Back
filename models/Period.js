const mongoose = require('mongoose');

// Esquema para Periodos académicos
const periodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del periodo es requerido'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'El código del periodo es requerido'],
    unique: true,
    uppercase: true,
    trim: true
  },
  academicYear: {
    type: String,
    required: [true, 'El año académico es requerido']
  },
  semester: {
    type: String,
    enum: ['Enero-Junio', 'Agosto-Diciembre', 'Intersemestral'],
    required: true
  },
  dates: {
    enrollmentStart: {
      type: Date,
      required: true
    },
    enrollmentEnd: {
      type: Date,
      required: true
    },
    classStart: {
      type: Date,
      required: true
    },
    classEnd: {
      type: Date,
      required: true
    },
    examPeriodStart: {
      type: Date
    },
    examPeriodEnd: {
      type: Date
    }
  },
  recruitmentPhases: {
    prospecting: {
      start: Date,
      end: Date
    },
    campaignsActive: {
      start: Date,
      end: Date
    },
    applicationProcess: {
      start: Date,
      end: Date
    },
    entranceExam: {
      date: Date
    },
    resultsPublication: {
      date: Date
    },
    enrollment: {
      start: Date,
      end: Date
    }
  },
  targets: {
    totalEnrollmentGoal: {
      type: Number,
      min: 0
    },
    newStudentsGoal: {
      type: Number,
      min: 0
    },
    prospectsGoal: {
      type: Number,
      min: 0
    }
  },
  statistics: {
    totalEnrolled: {
      type: Number,
      default: 0
    },
    newStudents: {
      type: Number,
      default: 0
    },
    totalProspects: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['Planificado', 'Activo', 'En curso', 'Finalizado', 'Cerrado'],
    default: 'Planificado'
  },
  active: {
    type: Boolean,
    default: true
  },
  isCurrent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices
periodSchema.index({ code: 1 });
periodSchema.index({ academicYear: 1, semester: 1 });
periodSchema.index({ status: 1 });
periodSchema.index({ isCurrent: 1 });
periodSchema.index({ 'dates.enrollmentStart': 1 });

// Solo puede haber un periodo activo a la vez
periodSchema.pre('save', async function(next) {
  if (this.isCurrent) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
  next();
});

// Método para verificar si está en periodo de inscripción
periodSchema.methods.isEnrollmentOpen = function() {
  const now = new Date();
  return now >= this.dates.enrollmentStart && now <= this.dates.enrollmentEnd;
};

// Método para calcular tasa de conversión
periodSchema.methods.calculateConversionRate = function() {
  if (this.statistics.totalProspects > 0) {
    this.statistics.conversionRate = 
      (this.statistics.newStudents / this.statistics.totalProspects) * 100;
  }
  return this.statistics.conversionRate;
};

// Virtual para obtener el nombre completo
periodSchema.virtual('fullName').get(function() {
  return `${this.name} - ${this.academicYear}`;
});

const Period = mongoose.model('Period', periodSchema);

module.exports = Period;
