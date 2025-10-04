import type { Context } from "hono";
import { Artist } from "../models/Artist";

export const getArtists = async (c: Context) => {
  try {
    const artists = await Artist.find();
    return c.json(
      {
        status: "success",
        results: artists.length,
        data: {
          artists,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error getting artists:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get artists",
      },
      500
    );
  }
};

export const getArtist = async (c: Context) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Artist ID is required",
        },
        400
      );
    }

    const artist = await Artist.findById(id);

    if (!artist) {
      return c.json(
        {
          status: "fail",
          message: "Artist not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        data: { artist },
      },
      200
    );
  } catch (error) {
    console.error("Error getting artist:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get artist",
      },
      500
    );
  }
};

export const createArtist = async (c: Context) => {
  try {
    const { userId, bio, specialties, portfolioIds } =
      await c.req.json();

    if (!userId) {
      return c.json(
        {
          status: "fail",
          message: "userId is required",
        },
        400
      );
    }

    const artist = await Artist.create({
      userId,
      bio,
      specialties,
      portfolioIds,
    });

    return c.json(
      {
        status: "success",
        data: { artist },
      },
      201
    );
  } catch (error) {
    console.error("Error creating artist:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to create artist",
      },
      500
    );
  }
};

export const updateArtist = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { bio, specialties, portfolioIds } = await c.req.json();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Artist ID is required",
        },
        400
      );
    }

    const artist = await Artist.findByIdAndUpdate(
      id,
      { bio, specialties, portfolioIds },
      { new: true, runValidators: true }
    );

    if (!artist) {
      return c.json(
        {
          status: "fail",
          message: "Artist not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        data: { artist },
      },
      200
    );
  } catch (error) {
    console.error("Error updating artist:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to update artist",
      },
      500
    );
  }
};

export const deleteArtist = async (c: Context) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Artist ID is required",
        },
        400
      );
    }

    const artist = await Artist.findByIdAndDelete(id);

    if (!artist) {
      return c.json(
        {
          status: "fail",
          message: "Artist not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        message: "Artist deleted successfully",
      },
      200
    );
  } catch (error) {
    console.error("Error deleting artist:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to delete artist",
      },
      500
    );
  }
};
