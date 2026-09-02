import { Request, Response } from "express";
import pool from "../db/database";

export const getEmergencyReports = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      "SELECT * FROM emergency_reports ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching emergency reports:", error);

    res.status(500).json({
      message: "Failed to fetch emergency reports",
    });
  }
};

export const createEmergencyReport = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      user_id,
      title,
      description,
      location,
      latitude,
      longitude,
      severity,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO emergency_reports
      (user_id, title, description, location, latitude, longitude, severity)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        user_id,
        title,
        description,
        location,
        latitude,
        longitude,
        severity,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating emergency report:", error);

    res.status(500).json({
      message: "Failed to create emergency report",
    });
  }
};