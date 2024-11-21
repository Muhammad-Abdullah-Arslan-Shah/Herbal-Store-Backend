

// controllers/appointmentController.js
import Appointment from '../models/appointmentModel.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createAppointment = async (req, res) => {
  try {
      const { herbalist, appointmentTime, notes } = req.body;
      console.log("Authenticated User ID:", req.user?._id);
      
      const userId = req.user ? req.user._id : null;
      if (!userId || !herbalist || !appointmentTime) {
          return res.status(400).json(new ApiResponse(400, null, "User, herbalist, and appointmentTime are required fields."));
      }

      const newAppointment = new Appointment({
          user: userId,
          herbalist,
          appointmentTime: new Date(appointmentTime),
          notes,
          status: "Pending"
      });

      const savedAppointment = await newAppointment.save();
      res.status(201).json(new ApiResponse(201, savedAppointment, "Appointment created successfully."));
  } catch (error) {
      res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const getAppointmentsByUser = async (req, res) => {
  try {
      const appointments = await Appointment.find({ user: req.user.id }).populate('herbalist');
      res.status(200).json(new ApiResponse(200, appointments, "Appointments retrieved successfully."));
  } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getAppointmentsByHerbalist = async (req, res) => {
  try {
      const herbalistId = req.params.herbalistId;
      if (req.user.role !== 'Herbalist' || req.user.herbalistId !== herbalistId) {
          return res.status(403).json(new ApiResponse(403, null, 'You are not authorized to view these appointments.'));
      }

      const appointments = await Appointment.find({ herbalist: herbalistId }).populate('user');
      res.status(200).json(new ApiResponse(200, appointments, "Appointments for herbalist retrieved successfully."));
  } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getAllAppointments = async (req, res) => {
  try {
      const appointments = await Appointment.find().populate('user').populate('herbalist');
      res.status(200).json(new ApiResponse(200, appointments, "All appointments retrieved successfully."));
  } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
      const { appointmentId } = req.params;
      const { status, notes } = req.body;

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
          return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
      }

      if (req.user.role === 'Admin' || (req.user.role === 'Herbalist' && req.user.id === appointment.herbalist)) {
          appointment.status = status || appointment.status;
          appointment.notes = notes || appointment.notes;

          await appointment.save();
          return res.status(200).json(new ApiResponse(200, appointment, "Appointment status updated successfully."));
      } else {
          return res.status(403).json(new ApiResponse(403, null, 'You are not authorized to update this appointment.'));
      }
  } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const deleteAppointment = async (req, res) => {
  try {
      const { appointmentId } = req.params;

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
          return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
      }

      if (req.user.role === 'Admin') {
          await appointment.remove();
          return res.status(200).json(new ApiResponse(200, null, "Appointment deleted successfully."));
      } else {
          return res.status(403).json(new ApiResponse(403, null, 'You are not authorized to delete this appointment.'));
      }
  } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
