const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./config/config.env" });
const dbConnect = require("./config/db");
const corsOptions = require('./utils/corsOptions');
const credentials = require('./middlewares/credentials');



// Initialize Express app
const app = express();

// app.set("trust proxy", 1);
app.use(credentials);

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(cors(corsOptions));


const userRouter = require("./routes/users/userRoutes");
const authRouter=require("./routes/auth");
const noticeRouter = require("./routes/notice/noticeRoutes");
const hostelRouter = require("./routes/hostel/hostelRoute");
const studentRouter = require("./routes/student/studentRoutes");
const roomRouter =require("./routes/room/roomRoutes")
const caretakerRouter =require("./routes/caretaker/caretakerRoutes");
const wardenRouter=require("./routes/warden/wardenRoutes");
const notificationRouter = require("./routes/notification")
const complaintRouter=require("./routes/complaint/complaintRoutes");
const fineRouter =require("./routes/fine/fineRoutes");
const inventoryRouter = require("./routes/inventory/inventoryRoutes");
const staffRouter=require("./routes/staff/staffRoutes");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/",authRouter);
app.use("/api/v1/notice",noticeRouter);
app.use("/api/v1/hostel",hostelRouter);
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/room",roomRouter);
app.use("/api/v1/caretaker",caretakerRouter);
app.use("/api/v1/warden",wardenRouter);
app.use("/api/v1/notifications/",notificationRouter);
app.use("/api/v1/complaint",complaintRouter);
app.use("/api/v1/fine",fineRouter);
app.use("/api/v1/inventory",inventoryRouter)
app.use("/api/v1/staff",staffRouter)

// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to HostelHubPlus API');
  });


// Define PORT
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`app is listening on ${port}`);
    dbConnect()
  });
  


