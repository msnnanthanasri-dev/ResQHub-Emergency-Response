import { Request, Response } from "express";
import pool from "../db/database";

export const getResources = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        category,
        quantity,
        location,
        created_at
      FROM resources
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching resources:", error);

    res.status(500).json({
      message: "Failed to fetch resources",
    });
  }
};

export const createResource = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      category,
      quantity,
      location,
    } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({
        message: "Name, category and location are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO resources
        (name, category, quantity, location)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        name,
        category,
        quantity || 0,
        location,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating resource:", error);

    res.status(500).json({
      message: "Failed to create resource",
    });
  }
};

export const deleteResource = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM resources WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.json({
      message: "Resource deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting resource:", error);

    res.status(500).json({
      message: "Failed to delete resource",
    });
  }
};