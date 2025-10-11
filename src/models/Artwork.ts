import { model, Schema } from "mongoose";
import type { IArtwork } from "../types/artwork";

const ArtworkSchema = new Schema<IArtwork>(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: [true, "Artist reference is required"],
    },
    title: {
      type: String,
      required: [true, "Artwork title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Artwork description is required"],
      trim: true,
    },
    medium: {
      type: String,
      required: [true, "Artwork medium is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Artwork price is required"],
      min: [0, "Price must be a positive number"],
    },
    imageUrl: {
      type: String,
      required: [true, "Artwork image URL is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["For_Sale", "Archived"],
      default: "For_Sale",
    },
  },
  {
    timestamps: true,
    versionKey: false, // cleaner documents
  }
);

ArtworkSchema.index({ artistId: 1, title: 1 }, { unique: true });

ArtworkSchema.index({ artistId: 1 });

export const Artwork = model<IArtwork>("Artwork", ArtworkSchema);
