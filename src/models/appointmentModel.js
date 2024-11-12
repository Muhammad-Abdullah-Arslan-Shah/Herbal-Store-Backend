import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  herbalist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Herbalist', // Reference the Herbalist model
    required: true,
  },
  appointmentTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Canceled'],
    default: 'Pending',
  },
  notes: {
    type: String,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
