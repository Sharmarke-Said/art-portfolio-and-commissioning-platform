import { Artwork } from "../models/Artwork";
import * as factory from "../utils/handleFactory";

export const getArtworks = factory.getAll(Artwork);
export const getArtwork = factory.getOne(Artwork);
export const createArtwork = factory.createOne(Artwork);
export const updateArtwork = factory.updateOne(Artwork);
export const deleteArtwork = factory.deleteOne(Artwork);
