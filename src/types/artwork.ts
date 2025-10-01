import type { Types } from "mongoose";

export interface IArtwork {
  _id: Types.ObjectId;
  artistId: Types.ObjectId;
  title: string;
  description: string;
  medium: string;
  price: number;
  imageUrl: string;
  status: "For_Sale" | "Archived";
  createdAt: Date;
  updatedAt: Date;
}
