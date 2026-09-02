import { Request, Response } from "express";
import pool from "../db/database";

export const getAlerts = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        message,
        severity,
        location,
        created_at
      FROM alerts
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching alerts:", error);

    res.status(500).json({
      message: "Failed to fetch alerts",
    });
  }
};

export const createAlert = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      message,
      severity,
      location,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO alerts
        (title, message, severity, location)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        title,
        message,
        severity || "info",
        location || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating alert:", error);

    res.status(500).json({
      message: "Failed to create alert",
    });
  }
};

export const deleteAlert = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM alerts WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    res.json({
      message: "Alert deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting alert:", error);

    res.status(500).json({
      message: "Failed to delete alert",
    });
  }
};