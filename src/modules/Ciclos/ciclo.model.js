const mongoose = require("mongoose");

const CicloEscuelas = new mongoose.Schema(
  {
    // =========================
    // Identidad del ciclo
    // =========================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // =========================
    // Periodo del ciclo
    // =========================
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
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Ciclo", CicloEscuelas);
