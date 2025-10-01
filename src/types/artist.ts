import type { Types } from "mongoose";

export interface IArtist {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  bio: string;
  specialties: string[];
  portfolioIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
