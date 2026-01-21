const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    ies: {
      // Relación con IES (opcional)
      iesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IES",
        required: false,
      },
      iesName: {
        type: String,
        trim: true,
      },
    },
    // Datos generales
    name: {
      type: String,
      required: [true, "El nombre de la campaña es obligFatorio"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Presencial", "Virtual"],
      required: true,
    },
    specificModality: {
      type: String,
      required: true,
      enum: [
        "Feria/Evento",
        "Visita a escuela",
        "Tiktok",
        "Instagram",
        "Facebook",
        "YouTube",
        "General",
      ],
      trim: true,
    },
    period: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    // Alcance
    reach: {
      estimated: {
        type: Number,
        min: 0,
      },
      actual: {
        type: Number,
        min: 0,
      },
      unit: {
        type: String,
        enum: ["Personas", "Impresiones", "Clics", "Vistas", "Asistentes"],
        required: true,
      },
    },
    // Costos
    costs: {
      total: {
        type: Number,
        min: 0,
      },
      costPerImpact: {
        type: Number,
        min: 0,
      },
    },
    // IEMS objetivo
    targetedIEMS: [
      {
        _id: false,
        iemsId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "IEMS",
        },
        iemsName: {
          type: String,
          trim: true,
        },
      },
    ],
    promotedCareers: [
      {
        type: String,
        trim: true,
      },
    ],
    // Resultados
    results: {
      generatedLeads: {
        type: Number,
        default: 0,
        min: 0,
      },
      activeApplicants: {
        type: Number,
        default: 0,
        min: 0,
      },
      conversionRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      evaluationNotes: {
        type: String,
        trim: true,
      },
    },
    // Evidencias
    evidence: {
      photos: [String],
      videos: [String],
      documents: [String],
      digitalLinks: [String],
    },
    // Responsables
    responsible: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
          type: String,
          required: true,
      }
    },
    // Estado y control
    status: {
      type: String,
      enum: ["Planificada", "En curso", "Finalizada", "Cancelada"],
      default: "Planificada",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Ciclo
    cycle: {
      cycleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ciclo",
        required: true,
      },
      cycleName: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

campaignSchema.pre("save", function () {
  // Costo por impacto
  if (this.costs?.total) {
    const impact = this.reach?.actual || this.reach?.estimated;

    if (impact) {
      this.costs.costPerImpact = this.costs.total / impact;
    }
  }

  // Tasa de conversión
  if (this.results?.generatedLeads && this.reach?.actual) {
    this.results.conversionRate =
      (this.results.generatedLeads / this.reach.actual) * 100;
  }
});

campaignSchema.methods.updateStatus = function () {
  if (this.status === "Cancelada") return;

  const today = new Date();

  if (today < this.period.startDate) {
    this.status = "Planificada";
  } else if (today >= this.period.startDate && today <= this.period.endDate) {
    this.status = "En curso";
  } else {
    this.status = "Finalizada";
  }
};

campaignSchema.index({ "ies.iesId": 1, "period.startDate": -1 });
campaignSchema.index({ type: 1, specificModality: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ "cycle.cycleId": 1 });

module.exports = mongoose.model("Campaign", campaignSchema);

// const campaignSchema = new mongoose.Schema({
//   ies: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'IES'
//   },
//   name: {
//     type: String,
//     required: [true, 'El nombre de la campaña es requerido'],
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   type: {
//     type: String,
//     enum: {
//       values: ['Presencial', 'Tradicional', 'Digital'],
//       message: '{VALUE} no es un tipo válido'
//     }
//   },
//   specificModality: {
//     type: String,
//     enum: [
//       // Presencial
//       // 'Conferencias',
//       'Proyectos de innovación',
//       'Visitas a IEMS',
//       'Visitas guiadas a campus',
//       'Volanteo',
//       'Open house',
//       'Ferias universitarias',
//       'Participación en eventos académicos y deportivos',
//       'Transporte institucional a actividades del campus',
//       'Difusión en talleres y laboratorios',
//       'Actividades culturales y demostraciones',
//       // Tradicional
//       'Radio institucional y comercial',
//       'Televisión local o estatal',
//       'Publicidad impresa en periódico',
//       'Espectaculares digitales y analógicos',
//       'Revistas especializadas en educación',
//       'Perifoneo',
//       // Digital
//       'Facebook',
//       'Instagram',
//       'TikTok',
//       'YouTube y videoblogs',
//       'Telegram',
//       'WhatsApp',
//       'Mensajería SMS',
//       'Reels y Trends',
//       'Publicaciones fotográficas especializadas',
//       'Videoconferencias en plataformas educativas'
//     ]
//   },
//   period: {
//     startDate: Date,
//     endDate: Date
//   },
//   reach: {
//     estimated: {
//       type: Number,
//       min: 0
//     },
//     actual: {
//       type: Number,
//       min: 0
//     },
//     unit: {
//       type: String,
//       enum: ['Personas', 'Impresiones', 'Clics', 'Vistas', 'Asistentes'],
//       default: 'Personas'
//     }
//   },
//   costs: {
//     total: {
//       type: Number,
//       min: 0
//     },
//     costPerImpact: {
//       type: Number,
//       min: 0
//     }
//   },
//   targetedIEMS: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'IEMS'
//   }],
//   promotedCareers: [String],
//   results: {
//     generatedLeads: {
//       type: Number,
//       default: 0
//     },
//     activeApplicants: {
//       type: Number,
//       default: 0
//     },
//     conversionRate: {
//       type: Number,
//       min: 0,
//       max: 100
//     },
//     evaluationNotes: String
//   },
//   evidence: {
//     photos: [String], // URLs
//     videos: [String], // URLs
//     documents: [String], // URLs
//     digitalLinks: [String]
//   },
//   responsible: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   status: {
//     type: String,
//     enum: ['Planificada', 'En curso', 'Finalizada', 'Cancelada'],
//     default: 'Planificada'
//   },
//   active: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Índices
// campaignSchema.index({ ies: 1, 'period.startDate': -1 });
// campaignSchema.index({ type: 1, specificModality: 1 });
// campaignSchema.index({ status: 1 });

// // Pre-save: calcular costo por impacto
// campaignSchema.pre('save', function() {
//   if (this.reach.actual && this.costs.total) {
//     this.costs.costPerImpact = this.costs.total / this.reach.actual;
//   } else if (this.reach.estimated && this.costs.total) {
//     this.costs.costPerImpact = this.costs.total / this.reach.estimated;
//   }

//   // Calcular tasa de conversión
//   if (this.results.generatedLeads && this.reach.actual) {
//     this.results.conversionRate = (this.results.generatedLeads / this.reach.actual) * 100;
//   }
// });

// // Método para actualizar estado según fechas
// campaignSchema.methods.updateStatus = function() {
//   const today = new Date();
//   if (this.status === 'Cancelada') return;

//   if (today < this.period.startDate) {
//     this.status = 'Planificada';
//   } else if (today >= this.period.startDate && today <= this.period.endDate) {
//     this.status = 'En curso';
//   } else if (today > this.period.endDate) {
//     this.status = 'Finalizada';
//   }
// };
