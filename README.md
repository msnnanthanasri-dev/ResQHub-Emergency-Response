# 🚨 ResQHub – Emergency Response Management Platform

ResQHub is a full-stack emergency response management platform designed to help authorities coordinate and manage emergency situations through a centralized web application.

The platform brings emergency reports, volunteers, relief camps, resources, alerts, and geographical information together in one system. It provides a dashboard where important emergency response information can be monitored and managed efficiently.

## 🎯 Project Objective

The main objective of ResQHub is to improve emergency response coordination by providing a centralized platform for managing incidents, volunteers, relief camps, resources, and emergency notifications.

It can be useful during situations such as floods, cyclones, fires, earthquakes, and other disaster-related emergencies.

## ✨ Features

* 🚨 **Emergency Reports** – Create and manage emergency incidents with location, severity, description, and status.
* 👥 **Volunteer Management** – Add, view, and manage volunteers based on their skills, availability, and location.
* 🏕️ **Relief Camps** – Manage relief camps, including capacity, current occupancy, location, and status.
* 📦 **Resource Management** – Track emergency supplies such as food, water, medicines, and blankets.
* 🔔 **Emergency Alerts** – Create and manage important emergency notifications with severity and location.
* 🗺️ **GIS Map** – Display emergency-related locations using geographical coordinates.
* 📊 **Dashboard** – View emergency statistics, recent reports, alerts, volunteer status, camps, resources, and quick actions from one place.

## 🛠️ Technologies Used

### Frontend

* React
* TypeScript
* Vite
* React Router
* React Leaflet
* CSS

### Backend

* Node.js
* Express.js
* TypeScript
* REST API
* CORS
* dotenv

### Database

* PostgreSQL
* Node PostgreSQL (`pg`)

## 📁 Project Structure

```text
ResQHub/
│
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
│
├── server/              # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── db/
│   ├── app.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔗 Main API Endpoints

```text
GET    /api/emergency-reports
POST   /api/emergency-reports

GET    /api/volunteers
POST   /api/volunteers
DELETE /api/volunteers/:id

GET    /api/relief-camps
POST   /api/relief-camps
DELETE /api/relief-camps/:id

GET    /api/resources
POST   /api/resources
DELETE /api/resources/:id

GET    /api/alerts
POST   /api/alerts
DELETE /api/alerts/:id

GET    /api/health
```

## 🚀 How to Run

### 1. Start the Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 2. Start the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5175
```

### 3. Database

Create a PostgreSQL database and configure the database connection details in the backend environment file.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resqhub
DB_USER=postgres
DB_PASSWORD=your_password
```

**Do not upload your `.env` file or database password to GitHub.**

## 🔄 System Workflow

```text
Emergency Report
       ↓
Emergency Dashboard
       ↓
┌───────────────┬───────────────┬───────────────┐
│               │               │               │
Volunteers   Relief Camps    Resources       Alerts
│               │               │               │
└───────────────┴───────────────┴───────────────┘
                       ↓
              Emergency Response
```

## 🌟 Future Enhancements

Future versions of ResQHub can include:

* Real-time emergency notifications
* User authentication and role-based access
* Live volunteer and vehicle tracking
* Mobile application
* Advanced GIS features
* Emergency analytics and reports
* AI-based emergency classification
* Cloud deployment
* Multi-language support

## 📌 Project Status

**Active Development 🚧**

The core emergency management modules have been implemented, including emergency reports, volunteers, relief camps, resources, alerts, dashboard, and GIS mapping.

## 👨‍💻 Author

**ResQHub – Emergency Response Management Platform**

Built as a full-stack web application for emergency response and disaster management.
