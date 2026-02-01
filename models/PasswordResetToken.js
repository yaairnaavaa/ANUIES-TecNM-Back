const mongoose = require("mongoose");

const passwordResetTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Índice para limpiar tokens expirados y buscar por token
passwordResetTokenSchema.index({ token: 1 });
passwordResetTokenSchema.index({ email: 1, used: 1 });

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
