const mongoose = require("mongoose");

const CarreraSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // unique: true,
      required: [true, "Una carrera necesita un nombre"],
    },
    shortName: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 10,
      uppercase: true,
    },
    code: {
      type: String,
      // unique: true,
      required: [true, "Una carrera necesita un código"],
      uppercase: true,
    },
    ies: {
      iesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IES",
        required: false,
      },
      iesName: {
        type: String,
        trim: true,
      },
      iesShortname: {
        type: String,
        trim: true,
      },
    },
    modality: {
      type: String,
      enum: ["Presencial", "Mixta", "Virtual"],
      default: "Presencial",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

CarreraSchema.index({ name: 1 });
CarreraSchema.index({ code: 1 });
// CarreraSchema.index({ "ies.iesId": 1 });
CarreraSchema.index({ active: 1 });

module.exports = mongoose.model("Carrera", CarreraSchema);
