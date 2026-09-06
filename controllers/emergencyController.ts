import { Request, Response } from "express";
import pool from "../db/database";

// ==========================================
// GET ALL EMERGENCY REPORTS
// ==========================================
export const getEmergencyReports = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        user_id,
        title,
        description,
        location,
        latitude,
        longitude,
        severity,
        status,
        created_at
      FROM emergency_reports
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching emergencies:", error);

    res.status(500).json({
      message: "Failed to fetch emergencies",
    });
  }
};

// ==========================================
// CREATE EMERGENCY REPORT
// ==========================================
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
      status,
    } = req.body;

    if (!title || !location) {
      return res.status(400).json({
        message: "Title and location are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO emergency_reports
      (
        user_id,
        title,
        description,
        location,
        latitude,
        longitude,
        severity,
        status
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        user_id || null,
        title,
        description || null,
        location,
        latitude ?? null,
        longitude ?? null,
        severity || "medium",
        status || "pending",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating emergency:", error);

    res.status(500).json({
      message: "Failed to create emergency",
    });
  }
};

// ==========================================
// UPDATE / EDIT EMERGENCY
// ==========================================
export const updateEmergencyReport = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      user_id,
      title,
      description,
      location,
      latitude,
      longitude,
      severity,
      status,
    } = req.body;

    console.log("Updating emergency:", {
      id,
      title,
      location,
      severity,
      status,
    });

    if (!title || !location) {
      return res.status(400).json({
        message: "Title and location are required",
      });
    }

    const result = await pool.query(
      `
      UPDATE emergency_reports
      SET
        user_id = $1,
        title = $2,
        description = $3,
        location = $4,
        latitude = $5,
        longitude = $6,
        severity = $7,
        status = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        user_id || null,
        title,
        description || null,
        location,
        latitude ?? null,
        longitude ?? null,
        severity || "medium",
        status || "pending",
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Emergency report not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating emergency:", error);

    res.status(500).json({
      message: "Failed to update emergency",
    });
  }
};

// ==========================================
// DELETE EMERGENCY
// ==========================================
export const deleteEmergencyReport = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM emergency_reports
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Emergency report not found",
      });
    }

    res.json({
      message: "Emergency report deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting emergency:", error);

    res.status(500).json({
      message: "Failed to delete emergency",
    });
  }
};
