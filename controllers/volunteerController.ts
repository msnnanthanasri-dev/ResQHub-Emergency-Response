import { Request, Response } from "express";
import pool from "../db/database";

// Get all volunteers
export const getVolunteers = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        skills AS skill,
        location,
        phone,
        CASE
          WHEN availability = true THEN 'Available'
          ELSE 'Unavailable'
        END AS status,
        NULL AS assignment
      FROM volunteers
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching volunteers:", error);

    res.status(500).json({
      message: "Failed to fetch volunteers",
    });
  }
};


// Create a new volunteer
export const createVolunteer = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      skill,
      location,
      phone,
      status,
    } = req.body;

    if (!name || !skill || !location) {
      return res.status(400).json({
        message: "Name, skill and location are required",
      });
    }

    const availability =
      status?.toLowerCase() === "available";

    const result = await pool.query(
      `
      INSERT INTO volunteers
        (name, phone, skills, availability, location)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        phone,
        skills AS skill,
        location,
        CASE
          WHEN availability = true THEN 'Available'
          ELSE 'Unavailable'
        END AS status,
        NULL AS assignment
      `,
      [
        name,
        phone || null,
        skill,
        availability,
        location,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating volunteer:", error);

    res.status(500).json({
      message: "Failed to create volunteer",
    });
  }
};


// Delete a volunteer
export const deleteVolunteer = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM volunteers WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    res.json({
      message: "Volunteer deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting volunteer:", error);

    res.status(500).json({
      message: "Failed to delete volunteer",
    });
  }
};