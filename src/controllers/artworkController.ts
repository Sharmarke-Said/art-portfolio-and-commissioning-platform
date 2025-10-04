import type { Context } from "hono";
import { Artwork } from "../models/Artwork";

export const getArtworks = async (c: Context) => {
  try {
    const artworks = await Artwork.find();
    return c.json(
      {
        status: "success",
        results: artworks.length,
        data: {
          artworks,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error getting artworks:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get artworks",
      },
      500
    );
  }
};

export const getArtwork = async (c: Context) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Artwork ID is required",
        },
        400
      );
    }

    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return c.json(
        {
          status: "fail",
          message: "Artwork not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        data: { artwork },
      },
      200
    );
  } catch (error) {
    console.error("Error getting artwork:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get artwork",
      },
      500
    );
  }
};

export const createArtwork = async (c: Context) => {
  try {
    const {
      artistId,
      title,
      description,
      medium,
      price,
      imageUrl,
      status,
    } = await c.req.json();

    if (
      !artistId ||
      !title ||
      !description ||
      !medium ||
      !price ||
      !imageUrl
    ) {
      return c.json(
        {
          status: "fail",
          message: "All fields are required",
        },
        400
      );
    }

    const artwork = await Artwork.create({
      artistId,
      title,
      description,
      medium,
      price,
      imageUrl,
      status: status || "For_Sale",
    });

    return c.json(
      {
        status: "success",
        data: { artwork },
      },
      201
    );
  } catch (error) {
    console.error("Error creating artwork:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to create artwork",
      },
      500
    );
  }
};

export const updateArtwork = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { title, description, medium, price, imageUrl, status } =
      await c.req.json();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Artwork ID is required",
        },
        400
      );
    }

    const artwork = await Artwork.findByIdAndUpdate(
      id,
      { title, description, medium, price, imageUrl, status },
      { new: true, runValidators: true }
    );

    if (!artwork) {
      return c.json(
        {
          status: "fail",
          message: "Artwork not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        data: { artwork },
      },
      200
    );
  } catch (error) {
    console.error("Error updating artwork:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to update artwork",
      },
      500
    );
  }
};

export const deleteArtwork = async (c: Context) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Artwork ID is required",
        },
        400
      );
    }

    const artwork = await Artwork.findByIdAndDelete(id);

    if (!artwork) {
      return c.json(
        {
          status: "fail",
          message: "Artwork not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        message: "Artwork deleted successfully",
      },
      200
    );
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to delete artwork",
      },
      500
    );
  }
};
