
# HostelHubPLus

HostelHubbPlus is a MERN stack project meticulously crafted to optimize hostel operations. It offers hostel administrators a powerful platform to manage tasks like Hostel Allotment,Room allocation ,leave management, complaint handling, notice board management, Fine and inventory tracking with ease. 

Designed for four key actors—Students, Caretakers, Wardens, and Hostel Admins—each plays a crucial role in ensuring the system's efficient operation. 

[Use Case Diagram](https://photos.google.com/photo/AF1QipNxQJvD2WebnDZI2GydgNkdL0CM8rGvEpwLk4qv)






## Introduction
## Features

- ***Actor 1*** :- ****STUDENT****
    
    - **Notice Board** - Access important announcements and updates.
    - **View Rooms** - view available rooms and check their own allocated room.
    - **Complaint Registration** - Register complaints and track resolution status
    - **Leave Management** - Submit leave applications and track approval status
    - **View Fines** - View fines imposed on him
     - **View Attendance**

    Receive ***notifications*** for Hostel Allotment, Room allocation, leave approval or rejection, complaint resolution, and fines imposed.
    

- ***Actor 2*** :- ****CARETAKER****
    
    - **Room Management** - Allocate rooms to students, manually or randomly, and update room status as needed. Additionally, caretakers can facilitate room changes for students who wish to swap rooms and allocate vacant rooms to new students as required.
    - **Attendance Management** - Manage student attendance records efficiently.
    - **Inventory Management** - Track inventory levels, add new inventory items, and  warden get notify when items fall below a certain threshold.
    - **Notice Board Management** - Create ,Update and manage hostel notices for students.
    - **Student Information** - Access info about the students in the hostel.
    - **Fines Management** - Impose fines on students as necessary and maintain records of fines imposed.
    - **Complaint Resolution** - Address and resolve complaints lodged by students in a timely manner.
    - **View Leave** - view student leave approved or rejected by warden
    - **Manage Staff** - Organize and manage staff schedules effectively.
    Receive ***notifications*** for changes in role of caretaker , new complaints, and fines paid.



- ***Actor 3*** :- ****WARDEN****
    
    - **Manage Notice Board**
    - **View Rooms**
    - **View Complaints**
    - **Leave Management** - view and manage student leave applications, including updating leave statuses.
    - **View Fines** -  fines imposed on student
    - **Inventory Management** - View Inventory  get notify when items fall below a certain threshold.
    - **Student Information**


   Receive ***notifications*** for inventory thresholds, leave applications, changes in hostel allocation (warden in another hostel),


- ***Actor 4*** :- ****HOSTEL-ADMIN****
    
    - **Hostel Allocation** -Allocate hostels to students dynamically and manually
    - **Add hostel** - room configuration, specifying the number of single-seater, double-seater, and triple-seater rooms,
    - **Room Allocationt** -  Oversee and manage the allocation of rooms
    - **Assign Warden** 
    - **Assign Caretaker**
    - **Student Information**
## Installation

Clone the repository:

```bash
 git clone https://github.com/Iamankit45/HostelHubPlus.git
  
```

Go to the project directory

```bash
  cd HostelhubPlus
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
backened: npm run dev
frontened: npm start
```

Before running npm run dev, you will need the following environment variables:

```bash

just make a config.env file in config folder with these environment variables:-

MONGODB_URL= <This is your MongoDb URI>
JWT_KEY =<This is your access token secret>

```
For inserting dummy data of student I have kept the students_data.json file you just have to run

```bash
  node insert_data.js
```
## Screenshots

[![Screenshot-2024-05-21-at-1-27-16-AM.png](https://i.postimg.cc/Y0tsBVY9/Screenshot-2024-05-21-at-1-27-16-AM.png)](https://postimg.cc/jwkXzM80)




[![Screenshot-2024-05-21-at-1-49-50-AM.png](https://i.postimg.cc/rscwX8fr/Screenshot-2024-05-21-at-1-49-50-AM.png)](https://postimg.cc/dkHYGKPs)



[![Screenshot-2024-05-21-at-1-40-00-AM.png](https://i.postimg.cc/BnwbLfnr/Screenshot-2024-05-21-at-1-40-00-AM.png)](https://postimg.cc/qNy4SYnw)

[![Screenshot-2024-05-21-at-1-40-39-AM.png](https://i.postimg.cc/FKMKpbcG/Screenshot-2024-05-21-at-1-40-39-AM.png)](https://postimg.cc/CZ4YLqcf)

[![Screenshot-2024-05-21-at-1-34-14-AM.png](https://i.postimg.cc/dtwLg9fx/Screenshot-2024-05-21-at-1-34-14-AM.png)](https://postimg.cc/0rXkw7PY)

[![Screenshot-2024-05-21-at-1-55-18-AM.png](https://i.postimg.cc/prZXPgS1/Screenshot-2024-05-21-at-1-55-18-AM.png)](https://postimg.cc/1V8ZHYsp)

[![Screenshot-2024-05-21-at-1-50-34-AM.png](https://i.postimg.cc/g0XJ3twn/Screenshot-2024-05-21-at-1-50-34-AM.png)](https://postimg.cc/zLN8rjFr)
