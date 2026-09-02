import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/database";

import emergencyRoutes from "./routes/emergencyRoutes";
import volunteerRoutes from "./routes/volunteerRoutes";
import reliefCampRoutes from "./routes/reliefCampRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import alertRoutes from "./routes/alertRoutes";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// API ROUTES
// ===============================

app.use("/api/emergency-reports", emergencyRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/relief-camps", reliefCampRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/alerts", alertRoutes);

// ===============================
// TEST API
// ===============================
app.get("/api/test-volunteers", (_req, res) => {
  res.json({
    message: "Volunteer route system is working"
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: "ResQHub API is running",
  });
});

// ===============================
// DATABASE HEALTH CHECK
// ===============================

app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "OK",
      service: "ResQHub Backend",
      database: "Connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    });
  }
});

// ===============================
// START SERVER
// ===============================
app.delete("/api/test-delete", (_req, res) => {
  res.json({
    message: "DELETE method is working",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ResQHub server running on http://localhost:${PORT}`);
});
