# 📦 Subscription Tracker Web App

A full-stack web application to track, manage, and renew user subscriptions — built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

- **User Authentication** (JWT-based)
- **Create, View, and Cancel Subscriptions**
- **Track Subscription Validity and Status**
- **Renew Subscriptions** with updated renewal dates
- **Subscription Categories** (e.g., Sports, Entertainment, Education)
- **Frequency Tracking**
- Simple UI with Bootstrap-styled cards and buttons

## 📁 Project Structure

Subscription-Tracker/web
├── backend/
│   ├── .idea/
│   ├── bin/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── node_modules/
│   ├── public/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── eslint.config.js
│   ├── package-lock.json
│   └── package.json
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md


## 🛠️ Tech Stack

- **Frontend**: JavaScript, Axios, React Router, HTML, CSS, Bootstrap (optional for styling)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Protected routes

## 🔧 Setup Instructions

### Prerequisites

- Node.js & npm
- MongoDB installed locally or use MongoDB Atlas

### Clone the Repository

```bash
git clone https://github.com/yourusername/subscription-tracker.git
cd subscription-tracker

cd backend
npm install

cd frontend
npm install

ADD Necessary Variables in your .env File

Run backend
npm run dev

Run frontend
npm start
