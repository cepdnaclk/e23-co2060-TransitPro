# 🚍 TransitPRO – Smart Mobility Booking & Transport Administration System

TransitPRO is a web-based smart transport management and booking system developed as part of the **CO2060 – Software Systems Design Project** at the Department of Computer Engineering, University of Peradeniya.

The system is designed to make public transport booking, vehicle rental, passenger management, and transport administration easier and more organized — for **all passengers**, not a single user group.

---

## 📌 Project Overview

TransitPRO provides two main interfaces:

### 👤 Passenger Portal

Passengers can:

- Search available transport routes
- View route and vehicle information
- Select specific seats through an interactive seat map
- View male/female categories of already-booked seats
- Enter and validate passenger information
- Make transport bookings
- Check booking status
- Receive booking notifications
- Generate QR digital tickets
- Download booking details as PDF
- Rent vehicles
- Compare transport options using Smart Travel

### 👨‍💼 Administrator Portal

Administrators can:

- Manage vehicles
- Manage routes
- View and manage bookings
- Approve or reject bookings
- Monitor booking status
- View passenger information
- Generate trip passenger manifests
- Monitor vehicle occupancy
- View operational information through the dashboard
- Export manifests as PDF

---

## ⭐ Main Features

### 🚌 Route Management
Search routes by pickup and destination, view departure and arrival information, vehicle details, available seats, and transport pricing.

### 💺 Interactive Seat Booking
An interactive seat map shows 🟢 available, 🔵 selected, 🔷 male-booked, 🩷 female-booked, and ⚪ other unavailable seats, backed by server-side availability checking to prevent double-booking.

### 👤 Passenger Information
Collects full name, gender, contact number, travel date, seat number, and pickup location, with phone numbers validated against the 10-digit Sri Lankan format.

### 🎫 Booking & Digital Tickets
Every successful booking generates a unique reference, live status, a booking timeline, and a QR digital ticket downloadable as a PDF.

### 🔔 Notifications
Passengers receive updates on booking approval and status changes.

### 🚗 Vehicle Rental
Users can rent available vehicles, with rental details validated by the system.

### 🧭 Smart Travel
Lets users compare available transport options to make a more informed travel choice.

### 📋 Passenger Manifest & 📊 Operations Dashboard
Admins generate trip manifests (exportable as PDF) and monitor bookings, occupancy, and operational alerts from a live dashboard.

---

## 🛠️ Technologies Used

**Frontend:** React.js, Vite, JavaScript, HTML5, CSS3
**Backend:** Node.js, Express.js, REST API
**Database:** MongoDB, Mongoose
**Tools:** Git, GitHub, npm, PDF generation, QR code generation, Lucide Icons, Recharts

---

## 🏗️ System Architecture

TransitPRO follows a three-tier web application architecture: a **React + Vite** presentation layer, a **Node.js + Express** application layer, and a **MongoDB** data layer, connected via REST API and Mongoose.

---

## 🔄 Booking Workflow

Search Route → Select Route → Select Seat → Enter Passenger Details → Validate Information → Create Booking → Pending → Admin Approval → Approved (or Rejected) → QR Digital Ticket → Trip → Completed

---

## 🔒 Validation & Reliability

Validation runs at both frontend and backend levels: required passenger fields, 10-digit phone number checks, gender validation, travel-date validation, seat selection and availability checks, booking status validation, and vehicle capacity validation.

---

## 👥 Project Team

**Department of Computer Engineering, University of Peradeniya**

- N.A.N.D.N. Arachchi — E/23/017
- T.T.R. Yapa — E/23/454
- H.P.L.N. Yashassri — E/23/455

---

## 🚀 Future Improvements

Online payment integration, SMS and email notifications, real-time vehicle tracking, driver management, digital driver manifests, waitlist management, advanced transport analytics, and a mobile application.

---

## 🔗 Project Links

- **GitHub Repository:** [e23-co2060-TransitPro](https://github.com/cepdnaclk/e23-co2060-TransitPro)

---

**TransitPRO – Smart Mobility Booking & Transport Administration System** 🚍
