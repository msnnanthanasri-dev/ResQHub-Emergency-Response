import { Request, Response } from "express";
import pool from "../db/database";

// Get all relief camps
export const getReliefCamps = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        location,
        latitude,
        longitude,
        capacity,
        current_people,
        status,
        created_at
      FROM relief_camps
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching relief camps:", error);

    res.status(500).json({
      message: "Failed to fetch relief camps",
    });
  }
};


// Create a new relief camp
export const createReliefCamp = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      location,
      latitude,
      longitude,
      capacity,
      current_people,
      status,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Camp name and location are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO relief_camps
        (
          name,
          location,
          latitude,
          longitude,
          capacity,
          current_people,
          status
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        location,
        latitude,
        longitude,
        capacity,
        current_people,
        status,
        created_at
      `,
      [
        name,
        location,
        latitude || null,
        longitude || null,
        capacity || 0,
        current_people || 0,
        status || "active",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating relief camp:", error);

    res.status(500).json({
      message: "Failed to create relief camp",
    });
  }
};


// Delete a relief camp
export const deleteReliefCamp = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM relief_camps WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Relief camp not found",
      });
    }

    res.json({
      message: "Relief camp deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting relief camp:", error);

    res.status(500).json({
      message: "Failed to delete relief camp",
    });
  }
};
