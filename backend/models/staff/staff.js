// staff.model.js

const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    position: {
        type: String,
        enum: ['Cleaner', 'Maintenance Worker', 'Security Guard', 'Front Desk Staff', 'Other'],
        default: 'Other' // Set a default value if needed
    },
    contact: String,
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    }
    
});

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;
