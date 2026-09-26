# 🚍 TransitPRO – Smart Mobility Booking & Transport Administration System

TransitPRO is a web-based **smart transport management and booking system** developed as part of the **CO2060 – Software Systems Design Project** at the Department of Computer Engineering, University of Peradeniya.

The system is designed to make public transport booking, vehicle rental, passenger management, and transport administration easier and more organized.

---

## 📌 Project Overview

TransitPRO provides two main interfaces:

### 👤 Passenger Portal

Passengers can:

* Search available transport routes
* View route and vehicle information
* Select specific seats through an interactive seat map
* View male/female categories of already-booked seats
* Enter and validate passenger information
* Make transport bookings
* Check booking status
* Receive booking notifications
* Generate QR digital tickets
* Download booking details as PDF
* Rent vehicles
* Compare transport options using Smart Travel

### 👨‍💼 Administrator Portal

Administrators can:

* Manage vehicles
* Manage routes
* View and manage bookings
* Approve or reject bookings
* Monitor booking status
* View passenger information
* Generate trip passenger manifests
* Monitor vehicle occupancy
* View operational information through the dashboard
* Export manifests as PDF

---

## ⭐ Main Features

### 🚌 Route Management

* Search routes by pickup and destination
* View departure and arrival information
* View vehicle details
* View available seats
* Display transport pricing

### 💺 Interactive Seat Booking

TransitPRO provides an interactive seat map where passengers can select their preferred seats.

The seat map provides visual information about:

* 🟢 Available seats
* 🔵 Selected seats
* 🔷 Male-booked seats
* 🩷 Female-booked seats
* ⚪ Other unavailable/booked seats

The system also performs server-side availability checking to reduce the possibility of two passengers booking the same seat.

### 👤 Passenger Information

The booking system collects required passenger information including:

* Full name
* Gender
* Contact number
* Travel date
* Seat number
* Pickup location

Phone numbers are validated according to the required **10-digit Sri Lankan format**.

### 🎫 Booking & Digital Tickets

After a successful booking, passengers receive a unique booking reference.

The system provides:

* Booking reference
* Booking status
* Booking timeline
* QR digital ticket
* PDF ticket

### 🔔 Notifications

Passengers can check notifications related to their bookings, including booking approval and other status updates.

### 🚗 Vehicle Rental

Users can also rent available vehicles through the system.

The rental module provides vehicle information and validates the required rental details.

### 🧭 Smart Travel

The Smart Travel feature allows users to compare available transport options and make a more informed travel choice.

### 👨‍💼 Admin Booking Management

Administrators can:

* View bookings
* Filter bookings
* Approve bookings
* Reject bookings
* Update booking status
* View passenger information
* View seat information

### 📋 Passenger Manifest

The system can generate a trip passenger manifest containing:

* Passenger name
* Contact number
* Gender
* Seat number
* Pickup location
* Booking reference
* Booking status

The manifest can also be exported as a PDF.

### 📊 Operations Dashboard

The administrator dashboard provides operational information such as:

* Today's bookings
* Passenger counts
* Pending bookings
* Approved bookings
* Vehicle availability
* Passenger occupancy
* Upcoming trips
* Operational alerts

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* Mongoose

### Other Technologies & Tools

* Git
* GitHub
* npm
* PDF generation
* QR code generation
* Lucide Icons
* Recharts

---

## 🏗️ System Architecture

TransitPRO follows a three-tier web application architecture:

```text
┌───────────────────────────────┐
│       Presentation Layer      │
│                               │
│        React + Vite           │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│        Application Layer      │
│                               │
│       Node.js + Express       │
└───────────────┬───────────────┘
                │
                │ Mongoose
                ▼
┌───────────────────────────────┐
│           Data Layer          │
│                               │
│           MongoDB             │
└───────────────────────────────┘
```

---

## 📂 Project Structure

```text
TransitPRO/
│
├── code/
│   │
│   ├── frontend/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── backend/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── config/
│       ├── server.js
│       ├── package.json
│       └── ...
│
├── docs/
│   └── project documentation
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cepdnaclk/e23-co2060-TransitPro.git
cd e23-co2060-TransitPro
```

### 2. Backend Setup

```bash
cd code/backend
npm install
```

Create a `.env` file inside `code/backend`:

```env
MONGO_URL=your_mongodb_connection_string
PORT=5001
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5001
```

### 3. Frontend Setup

Open another terminal:

```bash
cd code/frontend
npm install
npm run dev
```

The frontend will normally be available through the Vite development URL shown in the terminal.

---

## 🔐 Environment Variables

Do **not** commit your actual MongoDB password or other secret credentials to GitHub.

Use:

```env
MONGO_URL=your_mongodb_connection_string
PORT=5001
```

and add `.env` to `.gitignore`.

---

## 🔄 Booking Workflow

```text
Passenger
    │
    ▼
Search Route
    │
    ▼
Select Route
    │
    ▼
Select Seat
    │
    ▼
Enter Passenger Details
    │
    ▼
Validate Information
    │
    ▼
Create Booking
    │
    ▼
Pending
    │
    ▼
Admin Approval
    │
    ├──────────────► Rejected
    │
    ▼
Approved
    │
    ▼
QR Digital Ticket
    │
    ▼
Trip
    │
    ▼
Completed
```

---

## 🔒 Validation & Reliability

TransitPRO includes validation at both frontend and backend levels.

Examples include:

* Required passenger fields
* 10-digit phone number validation
* Gender validation
* Travel-date validation
* Seat selection validation
* Seat availability checking
* Booking status validation
* Vehicle capacity validation

Server-side validation helps prevent invalid data from being submitted directly to the API.

---

## 👥 Project Team

**Department of Computer Engineering**
**University of Peradeniya**

### Team Members

* N.A.N.D.N. Arachchi - E/23/017
* T.T.R. Yapa - E/23/454
* H.P.L.N. Yashassri - E/23/455

---

## 🎓 Academic Project

**Course:** CO2060 – Software Systems Design Project
**Institution:** University of Peradeniya
**Department:** Computer Engineering

---

## 📸 Project Screenshots

Screenshots demonstrating the major features can be added here.

Recommended screenshots:

1. Home Page
2. Route Search
3. Interactive Seat Selection
4. Booking Form
5. Booking Status
6. QR Digital Ticket
7. Vehicle Rental
8. Smart Travel
9. Admin Dashboard
10. Passenger Manifest

---

## 🚀 Future Improvements

Possible future improvements include:

* Online payment integration
* SMS booking notifications
* Email notifications
* Real-time vehicle tracking
* Driver management
* Digital driver manifests
* Waitlist management
* Advanced transport analytics
* Mobile application

---

## 📄 License

This project was developed as an academic project for the **CO2060 – Software Systems Design Project** at the University of Peradeniya.

---

## 🙏 Acknowledgement

We would like to thank the lecturers, supervisors, evaluators, users, and everyone who provided feedback and guidance throughout the development of TransitPRO.

---

**TransitPRO – Smart Mobility Booking & Transport Administration System** 🚍
