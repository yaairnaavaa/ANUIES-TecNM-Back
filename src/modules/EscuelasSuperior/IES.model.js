const mongoose = require("mongoose");

const iesSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "La clave del Tecnológico es requerida"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "El nombre del Tecnológico es requerido"],
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    mision: {
      type: String,
      trim: true,
    },
    vision: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      number: String,
      neighborhood: String,
      municipality: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: "México",
      },
    },
    contact: {
      generalPhone: String,
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      website: String,
      responsable: String, // Responsable/Contacto principal
      nombreDirector: String, // Nombre del director de la institución
      socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        youtube: String,
        tiktok: String,
      },
    },
    careers: [
      {
        carreraId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Carrera",
          required: true,
        },
        carreraName: {
          type: String,
          trim: true,
        },
      },
    ],
    institutionalImage: {
      logo: String, // URL del logo
      logoPublicId: String, // ID de Cloudinary si se usa
      banner: String, // URL del banner
      bannerPublicId: String, // ID de Cloudinary si se usa
      gallery: [
        {
          url: String,
          publicId: String,
          description: String,
        }
      ], // URLs de imágenes del campus
    },
    branding: {
      primaryColor: {
        type: String,
        default: "#13163C",
      },
      secondaryColor: {
        type: String,
        default: "#FFFFFF",
      },
      accentColor: {
        type: String,
        default: "#059669",
      },
      fontFamily: {
        type: String,
        default: "Arial, sans-serif",
      },
      htmlPage: {
        type: String,
      }
    },
    ofertaEducativa: {
      descripcion: String,
      totalCarreras: {
        type: Number,
        default: 0,
      }
    },
    configuration: {
      enrollmentPeriod: {
        start: Date,
        end: Date,
      },
      requiresEntranceExam: {
        type: Boolean,
        default: true,
      },
      acceptsDirectPass: {
        type: Boolean,
        default: false,
      },
    },
    statistics: {
      totalEnrollment: Number,
      newEnrollmentLastPeriod: Number,
      firstSemesterDropoutRate: Number,
      lastUpdate: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Índices para búsquedas frecuentes
iesSchema.index({ "address.state": 1 });
iesSchema.index({ "careers.carreraName": 1 });
iesSchema.index({ active: 1 });
iesSchema.index(
  {
    _id: 1,
    "careers.carreraId": 1,
  },
  // { unique: true },
);

// Virtual para nombre completo
iesSchema.virtual("fullName").get(function () {
  return this.shortName || this.name;
});

// Método para obtener capacidad total
// iesSchema.methods.getTotalCapacity = function () {
//   return this.careers.reduce((total, career) => {
//     return total + (career.active ? career.capacityPerSemester : 0);
//   }, 0);
// };

module.exports = mongoose.model("IES", iesSchema);
