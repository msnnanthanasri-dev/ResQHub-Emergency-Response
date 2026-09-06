import { Request, Response } from "express";
import pool from "../db/database";

// ==========================================
// GET ALL VOLUNTEERS
// ==========================================
export const getVolunteers = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
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

// ==========================================
// CREATE VOLUNTEER
// ==========================================
export const createVolunteer = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      phone,
      email,
      skill,
      location,
      status,
    } = req.body;

    if (!name || !skill || !location) {
      return res.status(400).json({
        message: "Name, skill and location are required",
      });
    }

    // Convert frontend status to database boolean
    const availability =
      String(status).toLowerCase() === "unavailable"
        ? false
        : true;

    const result = await pool.query(
      `
      INSERT INTO volunteers
        (name, phone, email, skills, availability, location)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        name,
        phone || null,
        email || null,
        skill,
        availability,
        location,
      ]
    );

    res.status(201).json({
      id: result.rows[0].id,
      name: result.rows[0].name,
      phone: result.rows[0].phone,
      skill: result.rows[0].skills,
      location: result.rows[0].location,
      status: result.rows[0].availability
        ? "Available"
        : "Unavailable",
      assignment: null,
    });
  } catch (error) {
    console.error("Error creating volunteer:", error);

    res.status(500).json({
      message: "Failed to create volunteer",
    });
  }
};

// ==========================================
// UPDATE / EDIT VOLUNTEER
// ==========================================
export const updateVolunteer = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      skill,
      location,
      status,
    } = req.body;

    console.log("UPDATE VOLUNTEER:", {
      id,
      name,
      skill,
      location,
      phone,
      status,
    });

    if (!name || !skill || !location) {
      return res.status(400).json({
        message: "Name, skill and location are required",
      });
    }

    // Handles both "available" and "Available"
    const availability =
      String(status).toLowerCase() === "unavailable"
        ? false
        : true;

    const result = await pool.query(
      `
      UPDATE volunteers
      SET
        name = $1,
        phone = $2,
        email = $3,
        skills = $4,
        availability = $5,
        location = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        name,
        phone || null,
        email || null,
        skill,
        availability,
        location,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    res.json({
      id: result.rows[0].id,
      name: result.rows[0].name,
      phone: result.rows[0].phone,
      skill: result.rows[0].skills,
      location: result.rows[0].location,
      status: result.rows[0].availability
        ? "Available"
        : "Unavailable",
      assignment: null,
    });
  } catch (error) {
    console.error("Error updating volunteer:", error);

    res.status(500).json({
      message: "Failed to update volunteer",
    });
  }
};

// ==========================================
// DELETE VOLUNTEER
// ==========================================
export const deleteVolunteer = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM volunteers
      WHERE id = $1
      RETURNING id
      `,
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
