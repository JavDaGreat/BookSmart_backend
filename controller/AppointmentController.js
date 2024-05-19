const Appointment = require("../model/Appointment");
const Company = require("../model/Company");
const User = require("../model/User");

const getAllAppointments = async (req, res) => {
  const { id } = req.query;
  const foundUser = await User.findOne({ _id: id }).exec();
  const { isAdmin, companyId } = foundUser;
  if (!id || !foundUser) {
    return res.status(404).json({ message: "User not Found" });
  }

  let appointments;

  try {
    if (isAdmin) {
      const company = await Company.findById(companyId).populate(
        "appointments"
      );

      appointments = company.appointments;
    } else {
      appointments = await Appointment.find({
        authorizedUsers: foundUser.id,
      }).exec();
    }

    if (!appointments || appointments.length === 0) {
      return res.status(204).send();
    }

    for (let appointment of appointments) {
      for (let i = 0; i < appointment.authorizedUsers.length; i++) {
        const user = await User.findById(appointment.authorizedUsers[i]);
        appointment.authorizedUsersName[i] = user.name;
      }

      const createdByUser = await User.findById(appointment.createdBy);
      appointment.createdBy = createdByUser.name;
    }

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAppointment = async (req, res) => {
  const { title, companyId, start, end, description, createdBy } = req.body;
  const authorizedUsers = req.body?.guests || [];

  if (!companyId || !start || !end || !createdBy) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    const allAuthorizedUsers = [...authorizedUsers, createdBy];

    const appointment = await Appointment.create({
      title,
      companyId,
      start,
      end,
      description,
      createdBy,
      authorizedUsers: allAuthorizedUsers,
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateAppointment = async (req, res) => {
  const { updatedAppointment, isAdmin, appointmentId, userId } = req.body;

  for (let i = 0; i < updateAppointment.authorizedUsers.length; i++) {
    const user = await User.findOne({
      name: updateAppointment.authorizedUsers[i],
    });
    if (user) {
      updateAppointment.authorizedUsers[i] = user.id;
    }
  }

  if (!userId || !updatedAppointment || !appointmentId) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    const appointment = await Appointment.findById(appointmentId).exec();
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (isAdmin) {
      appointment.findByIdAndUpdate(
        appointmentId,
        { $set: updatedAppointment },
        { new: true }
      );
    }
    if (appointment.createdBy === userId) {
      await Appointment.findOneAndUpdate(
        { _id: appointmentId },
        { $set: updatedAppointment },
        { new: true }
      );
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  const { createdBy, appointmentId, isAdmin } = req.body;

  if (!createdBy || !appointmentId) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    let deletedAppointment;

    if (isAdmin) {
      deletedAppointment = await Appointment.deleteOne({ _id: appointmentId });
    } else {
      deletedAppointment = await Appointment.deleteOne({
        _id: appointmentId,
        createdBy,
      });
    }

    if (deletedAppointment.deletedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
