const mongoose = require("mongoose");

const iemsSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "La clave de la IEMS es requerida"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "El nombre de la IEMS es requerido"],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "BACHEST",
        "COBACH",
        "DGB",
        "DGB (CAED)",
        "UEMSTIS",
        "UEMSTAYCM",
        "AUTÓNOMA",
        "LCAE CMYOTENTAÑA",
        "LCOESCYTE",
        "CECYTE",
        "GCAEMCYETZE",
        "RCAESC YIITE",
        "EMSAD",
        "CONALEP",
        "PREPAABIERTA",
        "TELEBACH",
        "TELEBACHCOMUNITARIOS",
        "CCAELCVYILTLEITO)",
        "PREFECO",
        "RCOECMYOTE",
        "TCOOBACH",
        "BTED",
        "BACHPART",
        "OCECYTE",
      ],
    },
    address: {
      street: String,
      number: String,
      neighborhood: String,
      locality: String,
      municipality: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: "México",
      },
    },
    contact: {
      directorName: String,
      generalPhone: String,
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      website: String,
      educationalCounselor: {
        name: String,
        email: String,
        phone: String,
      },
    },
    educationalOffer: [
      {
        career: String,
        modality: {
          type: String,
          enum: ["Presencial", "Mixta", "Virtual"],
          default: "Presencial",
        },
        tecNMAlignment: {
          type: String,
          enum: ["Alta", "Media", "Baja"],
          default: "Media",
          description: "Nivel de alineación curricular con carreras del TecNM",
        },
      },
    ],
    statistics: {
      totalEnrollment: Number,
      lastCycleGraduates: Number,
      graduatesByCareer: [
        {
          career: String,
          quantity: Number,
        },
      ],
      lastUpdate: Date,
    },
    linkage: {
      directPassAgreements: [
        {
          ies: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IES",
          },
          includedCareers: [String],
          validity: {
            start: Date,
            end: Date,
          },
          active: Boolean,
        },
      ],
      tecNMRelationship: {
        type: String,
        enum: ["Fuerte", "Moderada", "Débil", "Sin relación"],
        default: "Sin relación",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    //cambio code === cct?
    cct: {
      type: String,
      required: [true, "CCT REQUIRED"],
      unique: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Índices
iemsSchema.index({ state: 1, municipality: 1 });
iemsSchema.index({ type: 1 });
iemsSchema.index({ "educationalOffer.career": 1 });
iemsSchema.index({ active: 1 });

// Virtual para dirección completa
iemsSchema.virtual("fullAddress").get(function () {
  const d = this.address;
  return `${
    d.street || ""
  } ${d.number || ""}, ${d.neighborhood || ""}, ${d.municipality}, ${d.state}`;
});

// Método para obtener total de egresados
iemsSchema.methods.getTotalGraduates = function () {
  if (!this.statistics || !this.statistics.graduatesByCareer) {
    return 0;
  }
  return this.statistics.graduatesByCareer.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

module.exports = mongoose.model("IEMS", iemsSchema);
