import { model, Schema } from "mongoose";
import type { IArtwork } from "../types/artwork";

const ArtworkSchema = new Schema<IArtwork>(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Artist",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    medium: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["For_Sale", "Archived"],
      default: "For_Sale",
    },
  },
  { timestamps: true }
);

export const Artwork = model<IArtwork>("Artwork", ArtworkSchema);
