import Appointment from '../models/appointmentModel.js';

export const createAppointment = async (req, res) => {
  try {
    const { herbalist, appointmentTime, notes } = req.body;
    
    // Log to verify if req.user is set
    console.log("Authenticated User ID:", req.user?._id);
    
    const userId = req.user ? req.user._id : null;

    // Log to verify input fields
    console.log("User ID:", userId);
    console.log("Herbalist:", herbalist);
    console.log("Appointment Time:", appointmentTime);

    // Check if required fields are present
    if (!userId || !herbalist || !appointmentTime) {
      return res.status(400).json({ error: "User, herbalist, and appointmentTime are required fields." });
    }

    const newAppointment = new Appointment({
      user: userId,
      herbalist,
      appointmentTime: new Date(appointmentTime),
      notes,
      status: "Pending"
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// User-specific: Get all appointments for the user
export const getAppointmentsByUser = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).populate('herbalist');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Herbalist-specific: Get appointments for the herbalist
export const getAppointmentsByHerbalist = async (req, res) => {
  try {
    const herbalistId = req.params.herbalistId;
    
    // Check if the logged-in user is the herbalist
    if (req.user.role === 'Herbalist' || req.user.herbalistId !== herbalistId) {
      return res.status(403).json({ error: 'You are not authorized to view these appointments' });
    }

    const appointments = await Appointment.find({ herbalist: herbalistId }).populate('user');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin-specific: Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user').populate('herbalist');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin and Herbalist can update the appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if the user is an Admin or the assigned herbalist for this appointment
    if (req.user.role === 'Admin' || req.user.role === 'Herbalist' && req.user.id === appointment.herbalist) {
      
      // Update the appointment status and notes if provided    
      appointment.status = status || appointment.status;
      appointment.notes = notes || appointment.notes;

      await appointment.save();
      return res.status(200).json(appointment);
    } else {
      return res.status(403).json({ error: 'You are not authorized to update this appointment' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if the user is an admin or the assigned herbalist for this appointment
    if (req.user.role === 'Admin' ) {
      // Delete the appointment
      await appointment.remove();
      return res.status(200).json({ message: 'Appointment deleted successfully' });
    } else {
      return res.status(403).json({ error: 'You are not authorized to delete this appointment' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

