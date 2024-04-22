const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  companyId: {
    type: String,
    ref: "Business",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: String,
    ref: "User",
    required: true,
  },
  authorizedUsers: [
    {
      type: String,
      ref: "User",
      required: false,
    },
  ],
});
module.exports = mongoose.model("Appointment", AppointmentSchema);
