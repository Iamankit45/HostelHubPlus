// staff.controller.js

const mongoose = require('mongoose');
const Caretaker = require('../../models/caretaker/caretaker.js');
const Notification = require('../../models/notification/notification.js');
const User = require('../../models/user/user');
const Staff = require('../../models/staff/staff');
const StaffSchedule = require('../../models/staff/staffSchedule')

// Controller functions for staff management

// Create new staff member
exports.createStaff = async (req, res) => {
    try {
        const staff = await Staff.create(req.body);

        res.status(201).json({ data: staff, message: 'staff created successfully' });
    } catch (error) {
        console.error('Error creating staff:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all staff members
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.status(200).json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get staff member by ID
exports.getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        res.status(200).json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.hostelCleanerStaff = async (req, res) => {

    const hostelId=req.params.hostelId;
    try {
        const staff=await Staff.find({hostel:hostelId ,position:'Cleaner'});
        res.status(200).json(staff);

    } catch (error) 
    {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Update staff member by ID
exports.updateStaffById = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        res.status(200).json(staff);
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete staff member by ID
exports.deleteStaffById = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};







// Controller functions for staff schedule management

// Create new staff schedule




const transformSchedule = (schedule) => {
    const transformedSchedule = {};

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    daysOfWeek.forEach(day => {
        const daySchedule = schedule[day.charAt(0).toUpperCase() + day.slice(1)];
        if (daySchedule && typeof daySchedule === 'object') {
            transformedSchedule[day] = Object.entries(daySchedule).map(([timeSlot, staffId]) => ({
                timeSlot,
                staff: staffId,
            }));
        } else {
            transformedSchedule[day] = [];
        }
    });

    return transformedSchedule;
};

exports.createOrUpdateStaffSchedule = async (req, res) => {
    try {
        const { hostel, weekStartDate, schedule } = req.body;

        if (!mongoose.Types.ObjectId.isValid(hostel)) {
            return res.status(400).json({ error: 'Invalid hostel ID' });
        }

        const formattedSchedule = transformSchedule(schedule);

        console.log(formattedSchedule)
        let staffSchedule = await StaffSchedule.findOne({ hostel, weekStartDate });

        if (staffSchedule) {
            // Update existing schedule
            Object.assign(staffSchedule, formattedSchedule);
        } else {
            // Create new schedule
            staffSchedule = new StaffSchedule({
                hostel,
                weekStartDate,
                ...formattedSchedule,
            });
        }

        await staffSchedule.save();

        res.status(201).json({ message: 'Staff schedule saved successfully' });
    } catch (error) {
        console.error('Error creating or updating staff schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.getStaffSchedule = async (req, res) => {
    const { hostel, weekStartDate } = req.query;

    try {
        const schedule = await StaffSchedule.findOne({ hostel, weekStartDate })
            .populate('monday.staff')
            .populate('tuesday.staff')
            .populate('wednesday.staff')
            .populate('thursday.staff')
            .populate('friday.staff')
            .populate('saturday.staff')
            .populate('sunday.staff');

        if (!schedule) {
            return res.status(200).json({ message: 'No schedule found for this hostel and week' });
        }

        // Transform the schedule to match the expected frontend format
        const transformedSchedule = {};
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        daysOfWeek.forEach(day => {
            if (schedule[day] && schedule[day].length > 0) {
                transformedSchedule[day] = schedule[day].map(slot => ({
                    timeSlot: slot.timeSlot,
                    staff: slot.staff ? slot.staff._id : null
                }));
            } else {
                transformedSchedule[day] = [];
            }
        });

        res.status(200).json({
            hostel: schedule.hostel,
            weekStartDate: schedule.weekStartDate,
            schedule: transformedSchedule
        });
    } catch (error) {
        console.error('Error fetching staff schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Get all staff schedules
exports.getAllStaffSchedules = async (req, res) => {


    try {
        const staffSchedules = await StaffSchedule.find();
        res.status(200).json(staffSchedules);
    } catch (error) {
        console.error('Error fetching staff schedules:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get staff schedule by ID
exports.getStaffScheduleById = async (req, res) => {
    try {
        const staffSchedule = await StaffSchedule.findById(req.params.id);
        if (!staffSchedule) {
            return res.status(404).json({ error: 'Staff schedule not found' });
        }
        res.status(200).json(staffSchedule);
    } catch (error) {
        console.error('Error fetching staff schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update staff schedule by ID
exports.updateStaffScheduleById = async (req, res) => {
    try {
        const staffSchedule = await StaffSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!staffSchedule) {
            return res.status(404).json({ error: 'Staff schedule not found' });
        }
        res.status(200).json(staffSchedule);
    } catch (error) {
        console.error('Error updating staff schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete staff schedule by ID
exports.deleteStaffScheduleById = async (req, res) => {
    try {
        const staffSchedule = await StaffSchedule.findByIdAndDelete(req.params.id);
        if (!staffSchedule) {
            return res.status(404).json({ error: 'Staff schedule not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting staff schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
