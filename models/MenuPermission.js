const mongoose = require("mongoose");

const menuPermissionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    routerLink: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuPermission", menuPermissionSchema);
