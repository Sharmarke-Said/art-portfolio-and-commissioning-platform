import type { Context } from "hono";
import { Commission } from "../models/Commission";
import * as factory from "../utils/handleFactory";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";

// Admin
export const getCommissions = factory.getAll(Commission);

export const getCommission = factory.getOne(Commission);

export const deleteCommission = factory.deleteOne(Commission);

// Client
export const createCommission = catchAsync(async (c: Context) => {
  const clientId = c.get("user").id;
  const { artistId, description, budget, dueDate } =
    await c.req.json();

  if (!artistId || !description || !budget || !dueDate) {
    throw new AppError("Please provide all required fields", 400);
  }

  // Check for duplicate active commissions
  const existingCommission = await Commission.findOne({
    clientId,
    artistId,
    description,
    status: { $ne: "Cancelled" },
  });

  if (existingCommission) {
    throw new AppError(
      "A similar commission request already exists.",
      409
    );
  }

  const commission = await Commission.create({
    clientId,
    artistId,
    description,
    budget,
    dueDate,
    status: "Pending_Approval",
  });

  return c.json(
    {
      status: "success",
      data: { commission },
    },
    201
  );
});

export const getMyCommissions = catchAsync(async (c: Context) => {
  const clientId = c.get("user").id;

  const commissions = await Commission.find({ clientId })
    .populate("artistId", "name email")
    .sort({ createdAt: -1 });

  return c.json(
    {
      status: "success",
      results: commissions.length,
      data: { commissions },
    },
    200
  );
});

export const respondToRenegotiation = catchAsync(
  async (c: Context) => {
    const clientId = c.get("user").id;
    const { id } = c.req.param();
    const { action } = await c.req.json(); // 'accept' | 'decline'

    if (!action || !["accept", "decline"].includes(action)) {
      throw new AppError(
        "Action must be either 'accept' or 'decline'",
        400
      );
    }

    const commission = await Commission.findById(id).populate(
      "artistId",
      "name email"
    );
    if (!commission) throw new AppError("Commission not found", 404);

    if (commission.clientId.toString() !== clientId) {
      throw new AppError(
        "You are not authorized to respond to this commission",
        403
      );
    }

    if (commission.status !== "Pending_Approval") {
      throw new AppError(
        "Commission is not in a state that allows renegotiation response",
        400
      );
    }

    if (action === "accept") {
      commission.status = "In_Progress";
    } else {
      commission.status = "Cancelled";
    }

    await commission.save();

    return c.json(
      {
        status: "success",
        message:
          action === "accept"
            ? "Renegotiation accepted and commission updated"
            : "Renegotiation declined, commission cancelled",
        data: { commission },
      },
      200
    );
  }
);

// Artist
export const getAssignedCommissions = catchAsync(
  async (c: Context) => {
    const artistId = c.get("user").id;

    const commissions = await Commission.find({ artistId })
      .populate("clientId", "name email")
      .sort({ createdAt: -1 });

    return c.json({
      status: "success",
      results: commissions.length,
      data: { commissions },
    });
  }
);

export const acceptCommission = catchAsync(async (c: Context) => {
  const artistId = c.get("user").id;
  const { id } = c.req.param();

  const commission = await Commission.findById(id).populate(
    "clientId",
    "name email"
  );

  if (!commission) throw new AppError("Commission not found", 404);

  if (commission.artistId.toString() !== artistId) {
    throw new AppError(
      "You are not authorized to accept this commission",
      403
    );
  }

  if (commission.status !== "Pending_Approval")
    throw new AppError(
      "Commission cannot be accepted in its current state",
      400
    );

  commission.status = "In_Progress";
  await commission.save();

  return c.json({
    status: "success",
    message: "Commission accepted successfully",
    data: { commission },
  });
});

export const declineCommission = catchAsync(async (c: Context) => {
  const artistId = c.get("user").id;
  const { id } = c.req.param();

  const commission = await Commission.findById(id).populate(
    "clientId",
    "name email"
  );

  if (!commission) throw new AppError("Commission not found", 404);

  if (commission.artistId.toString() !== artistId) {
    throw new AppError(
      "You are not authorized to decline this commission",
      403
    );
  }

  if (commission.status !== "Pending_Approval")
    throw new AppError(
      "Commission cannot be declined in its current state",
      400
    );

  commission.status = "Cancelled";
  await commission.save();

  return c.json({
    status: "success",
    message: "Commission declined successfully",
    data: { commission },
  });
});

export const renegotiateCommission = catchAsync(
  async (c: Context) => {
    const artistId = c.get("user").id;
    const { id } = c.req.param();
    const { message, newBudget, newDueDate } = await c.req.json();

    if (!message)
      throw new AppError("Renegotiation message is required", 400);

    const commission = await Commission.findById(id).populate(
      "clientId",
      "name email"
    );

    if (!commission) throw new AppError("Commission not found", 404);

    if (commission.artistId.toString() !== artistId) {
      throw new AppError(
        "You are not authorized to renegotiate this commission",
        403
      );
    }

    if (commission.status !== "Pending_Approval")
      throw new AppError(
        "Commission cannot be renegotiated in its current state",
        400
      );

    if (commission.renegotiations.length > 0)
      throw new AppError(
        "A renegotiation is already pending. Wait for client response.",
        400
      );

    const renegotiation = {
      message,
      budget: newBudget || commission.budget,
      dueDate: newDueDate || commission.dueDate,
      createdAt: new Date(),
    };

    commission.renegotiations.push(renegotiation);
    await commission.save();

    return c.json({
      status: "success",
      message: "Renegotiation proposal sent successfully",
      data: { commission },
    });
  }
);

export const completeCommission = catchAsync(async (c: Context) => {
  const artistId = c.get("user").id;
  const { id } = c.req.param();

  const commission = await Commission.findById(id);
  if (!commission) throw new AppError("Commission not found", 404);

  if (commission.artistId.toString() !== artistId) {
    throw new AppError(
      "You are not authorized to complete this commission",
      403
    );
  }

  if (commission.status !== "In_Progress")
    throw new AppError(
      "Commission is not in progress and cannot be completed",
      400
    );

  const updatedCommission = await Commission.findByIdAndUpdate(
    id,
    { status: "Completed" },
    { new: true }
  ).populate("clientId", "name email");

  return c.json({
    status: "success",
    message: "Commission completed successfully",
    data: { commission: updatedCommission },
  });
});
