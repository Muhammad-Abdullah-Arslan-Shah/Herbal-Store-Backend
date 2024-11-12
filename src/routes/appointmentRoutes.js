import express from 'express';
import { createAppointment,deleteAppointment, getAppointmentsByUser, getAppointmentsByHerbalist, getAllAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import  userAuth  from '../middlewares/authMiddleware.js';
import checkHerbalist from '../middlewares/checkHerbalist.js';
import adminAuth from "../middlewares/adminAuthMiddleware.js"; // Import adminAuth middleware

const router = express.Router();

// User Routes
// Create an appointment (user can book an appointment with a herbalist)
router.post('/', userAuth, createAppointment);

// Get all appointments of a user
router.get('/user', userAuth, getAppointmentsByUser);

// Herbalist Routes
// Get appointments assigned to the herbalist
router.get('/herbalist/:herbalistId',  checkHerbalist, getAppointmentsByHerbalist);

// Admin Routes
// Get all appointments (admin only)
router.get('/admin', userAuth, adminAuth, getAllAppointments);

// Admin and Herbalist: Update appointment status
router.put('/:appointmentId', checkHerbalist, updateAppointmentStatus);
router.delete('/:appointmentId',userAuth, adminAuth , deleteAppointment);


export default router;
