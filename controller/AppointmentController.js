const Appointment = require("../models/Appointment");

const getAllAppointments = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "User not Found" });
  }
  const appointments = await Appointment.find({ authorizedUsers: id }).exec();
  if (!appointments || appointments.length === 0) {
    return res.status(204).send();
  }
  res.json(appointments);
};
const createAppointment = async (req, res) => {
  const { companyId, date, time, description, createdBy, authorizedUsers } =
    req.body;
  if (!companyId || !date || !time || !createdBy || !authorizedUsers) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    const allAuthorizedUsers = [...authorizedUsers, createdBy];

    const appointment = await Appointment.create({
      companyId,
      date,
      time,
      description,
      createdBy,
      authorizedUsers: allAuthorizedUsers,
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
