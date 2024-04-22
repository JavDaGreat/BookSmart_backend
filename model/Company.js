const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  tierPlan: {
    type: String,
    enum: ["Free", "Pro"],
    required: true,
  },
  userCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  users: [
    {
      type: String,
      ref: "User",
    },
  ],
  appointments: [
    {
      type: String,
      ref: "Appointment",
    },
  ],
});

module.exports = mongoose.model("Company", CompanySchema);
