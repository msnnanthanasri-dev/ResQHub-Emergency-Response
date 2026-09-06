import { Request, Response } from "express";
import pool from "../db/database";

// GET ALL RELIEF CAMPS
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

// CREATE RELIEF CAMP
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
        message: "Name and location are required",
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
      RETURNING *
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

// UPDATE / EDIT RELIEF CAMP
export const updateReliefCamp = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

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
        message: "Name and location are required",
      });
    }

    const result = await pool.query(
      `
      UPDATE relief_camps
      SET
        name = $1,
        location = $2,
        latitude = $3,
        longitude = $4,
        capacity = $5,
        current_people = $6,
        status = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        name,
        location,
        latitude || null,
        longitude || null,
        capacity || 0,
        current_people || 0,
        status || "active",
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Relief camp not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating relief camp:", error);

    res.status(500).json({
      message: "Failed to update relief camp",
    });
  }
};

// DELETE RELIEF CAMP
export const deleteReliefCamp = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM relief_camps
      WHERE id = $1
      RETURNING id
      `,
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
