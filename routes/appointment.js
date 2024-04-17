const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/AppointmentController");
const verifyJWT = require("../middleware/verifyJWT");
router
  .route("/")
  .get(verifyJWT, appointmentController.getAllAppointments)
  .post(verifyJWT, appointmentController.createAppointment)
  .put(verifyJWT, appointmentController.updateAppointment)
  .delete(verifyJWT, appointmentController.deleteAppointment);
module.exports = router;
