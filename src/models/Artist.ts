import { model, Schema } from "mongoose";
import type { IArtist } from "../types/artist";

const ArtistSchema = new Schema<IArtist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bio: {
      type: String,
      required: true,
    },
    specialties: {
      type: [String],
      required: true,
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
