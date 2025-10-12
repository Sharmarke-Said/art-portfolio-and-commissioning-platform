import type { Context } from "hono";
import { Artwork } from "../models/Artwork";
import { catchAsync } from "../utils/catchAsync";
import * as factory from "../utils/handleFactory";

export const getArtworks = factory.getAll(Artwork);
export const getArtwork = factory.getOne(Artwork);
// export const createArtwork = factory.createOne(Artwork);
export const updateArtwork = factory.updateOne(Artwork);
export const deleteArtwork = factory.deleteOne(Artwork);

export const getMyArtworks = catchAsync(async (c: Context) => {
  const artistId = c.get("user").id;

  const artworks = await Artwork.find({ artistId }).sort({
    createdAt: -1,
  });

  return c.json(
    {
      status: "success",
      results: artworks.length,
      data: { artworks },
    },
    200
  );
});

export const createArtwork = catchAsync(async (c: Context) => {
  const artistId = c.get("user").id;
  const { title, description, medium, price, imageUrl, status } =
    await c.req.json();

  // Check if artwork with the same title already exists for this artist
  const existingArtwork = await Artwork.findOne({ artistId, title });
  if (existingArtwork) {
    return c.json(
      {
        status: "fail",
        message:
          "An artwork with this title already exists in your portfolio",
      },
      400
    );
  }

  // Create the artwork
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
});

export const updateMyArtwork = catchAsync(async (c: Context) => {
  const artistId = c.get("user").id;
  const artworkId = c.req.param("id");
  const updates = await c.req.json();

  // Find artwork and verify ownership
  const artwork = await Artwork.findById(artworkId);
  if (!artwork) {
    return c.json(
      {
        status: "fail",
        message: "No artwork found with that ID",
      },
      404
    );
  }

  if (artwork.artistId.toString() !== artistId) {
    return c.json(
      {
        status: "fail",
        message: "You do not have permission to update this artwork",
      },
      403
    );
  }

  // If title is being updated, check for duplicates
  if (updates.title && updates.title !== artwork.title) {
    const existingArtwork = await Artwork.findOne({
      artistId,
      title: updates.title,
    });
    if (existingArtwork) {
      return c.json(
        {
          status: "fail",
          message:
            "An artwork with this title already exists in your portfolio",
        },
        400
      );
    }
  }

  // Update the artwork
  const updatedArtwork = await Artwork.findByIdAndUpdate(
    artworkId,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  return c.json(
    {
      status: "success",
      data: { artwork: updatedArtwork },
    },
    200
  );
});

export const deleteMyArtwork = catchAsync(async (c: Context) => {
  const artistId = c.get("user").id;
  const artworkId = c.req.param("id");

  // Find artwork and verify ownership
  const artwork = await Artwork.findById(artworkId);
  if (!artwork) {
    return c.json(
      {
        status: "fail",
        message: "No artwork found with that ID",
      },
      404
    );
  }

  if (artwork.artistId.toString() !== artistId) {
    return c.json(
      {
        status: "fail",
        message: "You do not have permission to delete this artwork",
      },
      403
    );
  }

  // Delete the artwork
  await Artwork.findByIdAndDelete(artworkId);

  return c.json(
    {
      status: "success",
      message: "Artwork deleted successfully",
    },
    200
  );
});
