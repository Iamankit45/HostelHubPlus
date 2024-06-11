const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('././models/user/user.js'); // Adjust the path as needed
const Student = require('././models/student/student.js');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertData() {
  try {
    const data = fs.readFileSync('students_data.json', 'utf-8');
    const studentsData = JSON.parse(data);

    for (let studentData of studentsData) {
      const { username, password, role, ...studentInfo } = studentData;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10); // Correctly passing 10 rounds for salt


      // Create User
      const user = new User({ username, password: hashedPassword, role });
      await user.save();

      // Create Student
      const student = new Student({ _id: user._id,username, ...studentInfo });
      await student.save();

      console.log(`Inserted data for ${username}`);
    }
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    mongoose.connection.close();
  }
}

insertData();
