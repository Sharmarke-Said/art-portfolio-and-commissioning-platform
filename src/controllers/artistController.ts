import { Artist } from "../models/Artist";

import * as factory from "../utils/handleFactory";

export const getArtists = factory.getAll(Artist);
export const getArtist = factory.getOne(Artist);
export const createArtist = factory.createOne(Artist);
export const updateArtist = factory.updateOne(Artist);
export const deleteArtist = factory.deleteOne(Artist);
