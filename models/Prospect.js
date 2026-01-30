const mongoose = require("mongoose");
const { validateCURP } = require("../utils/curpValidator");
const validator = require("validator");

const prospectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherLastName: {
      type: String,
      required: true,
      trim: true,
    },
    motherLastName: {
      type: String,
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
        validator: function (v) {
          if (!v) return true; // CURP es opcional
          return validateCURP(v);
        },
        message: "CURP no tiene un formato válido",
      },
      unique: true,
      required: [true, "Ingresa tu CURP"],
    },
    // ======================
    // CONTACTO
    // ======================
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Ingresa un Email válido"],
    },
    address: {
      street: String,
      number: String,
      neighborhood: String,
      locality: String,
      municipality: String,
      state: String,
      postalCode: String,
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
    observations: String,
    originIEMS: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IEMS",
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
        career: { type: String, required: true },
        priority: { type: Number, required: true, min: 1, max: 3 },
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
      registrationComplete: { type: Boolean, default: false },
      profileValidated: { type: Boolean, default: false },
      readNotifications: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
      ],
      lastInteraction: { type: Date, default: null },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

prospectSchema.index({ email: 1 }, { unique: true });
prospectSchema.index({
  fatherLastName: 1,
  motherLastName: 1,
  name: 1,
});

prospectSchema.methods.verifyRegistrationComplete = function () {
  const requiredFields = [
    this.name,
    this.fatherLastName,
    this.email,
    this.phone?.mobile,
    this.originIEMS,
    this.firstChoiceIES,
    Array.isArray(this.careerInterests) && this.careerInterests.length > 0,
  ];

  this.processStatus.registrationComplete = requiredFields.every(Boolean);
  return this.processStatus.registrationComplete;
};

prospectSchema.virtual("fullName").get(function () {
  return this.motherLastName
    ? `${this.name} ${this.fatherLastName} ${this.motherLastName}`
    : `${this.name} ${this.fatherLastName}`;
});

module.exports = mongoose.model("Prospect", prospectSchema);
