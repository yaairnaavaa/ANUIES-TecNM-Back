const mongoose = require("mongoose");
const { validateCURP } = require('../utils/curpValidator');

const prospectSchema = new mongoose.Schema(
  {
    // ======================
    // DATOS PERSONALES
    // ======================
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    birthDate: Date,

    gender: {
      type: String,
      enum: ["Masculino", "Femenino", "Otro", "Prefiero no decir"],
      default: "Prefiero no decir",
    },

    curp: {
      type: String,
      uppercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // CURP es opcional
          return validateCURP(v);
        },
        message: 'CURP no tiene un formato válido'
      }
    },

    // ======================
    // CONTACTO
    // ======================
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      mobile: {
        type: String,
        required: true,
      },
    },

    // ======================
    // INFORMACIÓN ACADÉMICA
    // ======================
    originIEMSName: {
      type: String,
      required: true,
    },

    originIEMS: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IEMS'
    },

    currentSemester: String,

    technicalMajor: String,

    averageGrade: {
      type: Number,
      min: 0,
      max: 10,
    },

    estimatedGraduationDate: Date,

    // ======================
    // INTERÉS ACADÉMICO
    // ======================
    firstChoiceIES: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IES",
      required: true,
    },

    careerInterests: [
      {
        career: {
          type: String,
          required: true,
        },
        priority: {
          type: Number,
          min: 1,
          max: 3,
        },
      },
    ],

    interestedShift: [
      {
        type: String,
        enum: ["Matutino", "Vespertino", "Nocturno"],
      },
    ],

    // ======================
    // MARKETING
    // ======================
    contactChannel: {
      type: String,
      enum: [
        "Feria universitaria",
        "Visita a IEMS",
        "Facebook",
        "Instagram",
        "TikTok",
        "Familiar o amigo",
        "Otro",
      ],
    },

    originCampaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },

    // ======================
    // ESTADO
    // ======================
    status: {
      type: String,
      default: "active",
    },
    processStatus: {
      type: Object,
      default: () => ({
        registrationComplete: false,
        profileValidated: false,
        readNotifications: [],
        lastInteraction: null,
      }),
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

prospectSchema.index({ email: 1 });

prospectSchema.methods.verifyRegistrationComplete = function () {
  const requiredFields = [
    this.firstName,
    this.lastName,
    this.email,
    this.phone?.mobile,
    this.address?.postalCode,
    this.originIEMS,
    this.firstChoiceIES,
    Array.isArray(this.careerInterests) && this.careerInterests.length > 0,
  ];

  this.processStatus.registrationComplete = requiredFields.every(Boolean);
  return this.processStatus.registrationComplete;
};

module.exports = mongoose.model("Prospect", prospectSchema);
