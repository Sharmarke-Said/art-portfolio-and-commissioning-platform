import type { Context } from "hono";
import { Model } from "mongoose";
import { catchAsync } from "./catchAsync";

export const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (c: Context) => {
    const { id } = c.req.param();
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return c.json(
        { status: "fail", message: "Document not found" },
        404
      );
    }

    return c.json(
      { status: "success", message: "Document deleted successfully" },
      200
    );
  });

export const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (c: Context) => {
    const { id } = c.req.param();
    const data = await c.req.json();

    const doc = await Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return c.json(
        { status: "fail", message: "Document not found" },
        404
      );
    }

    return c.json({ status: "success", data: doc }, 200);
  });

export const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (c: Context) => {
    const body = await c.req.json();
    const doc = await Model.create(body);

    return c.json({ status: "success", data: doc }, 201);
  });

export const getOne = <T>(
  Model: Model<T>,
  populateOptions?: string
) =>
  catchAsync(async (c: Context) => {
    const { id } = c.req.param();

    let query = Model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return c.json(
        { status: "fail", message: "Document not found" },
        404
      );
    }

    return c.json({ status: "success", data: doc }, 200);
  });

export const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (c: Context) => {
    const docs = await Model.find();
    return c.json(
      { status: "success", results: docs.length, data: docs },
      200
    );
  });
