import { model, Schema } from "mongoose";
import type { IArtist } from "../types/artist";

const ArtistSchema = new Schema<IArtist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User reference is required"],
      ref: "User",
      unique: true,
    },
    bio: {
      type: String,
      required: false,
      minLength: 30,
      maxlength: 500,
    },
    specialties: {
      type: [String],
      required: false,
      default: [],
    },
    portfolioIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],
  },
  { timestamps: true }
);

export const Artist = model<IArtist>("Artist", ArtistSchema);
