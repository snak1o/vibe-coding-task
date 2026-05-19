# API Plan

## Authentication
POST /api/auth/register  
Create a new user account  

POST /api/auth/login  
Authenticate user and the return token  

## Slots (Admin)
POST /api/slots  
Create a new time slot  

GET /api/slots  
Get all available time slots  

DELETE /api/slots/:id  
Delete a specific time slot  

## Appointments
POST /api/appointments  
Book a time slot  

GET /api/appointments/me  
Get current users appointments  

DELETE /api/appointments/:id  
Cancel an appointment  
