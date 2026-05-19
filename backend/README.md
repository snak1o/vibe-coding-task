# Appointment Booking System 
## Description

This project is a Node.js backend application for managing appointment bookings.
Users can register, log in and book available time slots. Admin users can create and manage appointment slots.

---

## Features

* User registration and login (authentication)
* Role-based access (admin and user)
* Create and manage time slots (admin)
* Book and cancel appointments (users)
* Prevent double booking of time slots
* Input validation and error handling
* Viewing all appointments (admin)

---

## Technologies

* Node.js
* Express
* MongoDB
* Mongoose
* JWT Authentication (JSON Web Token)

---

## API Endpoints
### Authentication
* **/api/auth** - Base route

* **POST /api/auth/register** – Create a new user
* **POST /api/auth/login** – Login and receive authentication token


### Slots (admin)

* **POST /api/slots** – Create a new time slot
* **GET /api/slots** – Show all available time slots
* **DELETE /api/slots/:id** – Delete a time slot

### Appointments

* **POST /api/appointments** - Book an appointment (user)
* **GET /api/appointments/my** - Show current user's appointments (user)
* **DELETE /api/appointments/:id** - Cancel an appointment (user/admin)
* **GET /api/appointments/all** - Get all appointments (admin)

---

## Environment variables

Create a `.env` file in the root folder and add:

PORT=3000
DBUSER=your_db_username
DBPASSWORD=your_db_password
JWT_SECRET=your_secret_key

---

## Requirements

* Node.js installed
* npm installed
* MongoDB (local installation or MongoDB Atlas)

---

## How to run the application

1. Clone the repository 
2. Run `npm install`
3. Create a `.env` file using the variables above
4. Run `npm start`
5. Server runs on http://localhost:3000

---
## Testing

The API was tested using:

- Postman
- Browser frontend
- MongoDB Atlas

Tested features:

- JWT protected routes
- Login and registration
- Slot creation
- Appointment booking
- Slot availability updates
- Double booking prevention
- Admin authorization

---
## Accessibility

Accessibility was considered during the development of the project.
Implemented accessibility features include:

- Semantic HTML structure
- Keyboard accessible navigation
- Form labels
- Focus-outlines for keyboard users
- ARIA labels for important buttons
- Role-based UI visibility
- Screen reader friendly structure

Accessibility testing was done using:

- VoiceOver (macOS)
- Keyboard-only navigation
- WAVE accessibility evaluation tool

## Authors

* Hanna Hanate
* Janne Piiroinen
* Ruslan Lysenko
