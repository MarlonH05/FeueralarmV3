const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const alertSchema = mongoose.Schema({
  classCount: { type: Number, required: true },
  archived: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },

  // Zusätzliche Metadaten
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { type: String, default: "" },
  location: { type: String, default: "" },

  // Statistiken (automatisch berechnet)
  stats: {
    total: { type: Number, default: 0 },
    complete: { type: Number, default: 0 },
    incomplete: { type: Number, default: 0 },
    undefined: { type: Number, default: 0 },
  },
});

alertSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Alert", alertSchema);
