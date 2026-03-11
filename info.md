📄Descrption

# DocPoint 🩺

**DocPoint** is a full-stack healthcare appointment booking platform where users can register, browse doctors, and book appointments online.

It includes **role-based access (User, Doctor, Admin)**, secure authentication, and a modern responsive UI.

---

## 🌐 Live Demo

Frontend:  
https://doc-point-beige.vercel.app/

Backend API:  
https://docpoint-md0b.onrender.com

GitHub Repository:  
https://github.com/rajkundan463/docPoint

---

## ✨ Features

- User Registration & Login (JWT Authentication)
- Doctor Profile Management
- Book & Manage Appointments
- Notification System
- Role Based Access  
  - User  
  - Doctor  
  - Admin
- Responsive UI Dashboard
- Secure Password Hashing

---

## 🛠 Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router
- Ant Design
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### Deployment
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas

---

## 📂 Project Structure



docPoint/
│
├── client/ # React Frontend
│ ├── src
│ ├── components
│ ├── pages
│ └── redux
│
├── server/ # Node Backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middlewares
│ └── config


---

## ⚙️ Installation

### 1️⃣ Clone the repository



git clone https://github.com/rajkundan463/docPoint

cd docPoint


### 2️⃣ Install dependencies

Frontend



cd client
npm install
npm start


Backend



cd server
npm install
npm run dev


---

## 🔑 Environment Variables

Create `.env` file in backend:



PORT=5000
MONGO_URL=your_mongodb_connection
JWT_SECRET=your_secret


---

## 📸 Screenshots

Login / Register Page  
Doctor Dashboard  
Appointment Booking

*(Add screenshots here for better portfolio impact)*

---

## 👨‍💻 Author

**Kundan Kumar**

GitHub  
https://github.com/rajkundan463

---

## ⭐ If you like this project

Give it a **star ⭐ on GitHub**.