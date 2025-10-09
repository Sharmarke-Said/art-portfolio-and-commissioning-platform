import type { Context } from "hono";
import { Commission } from "../models/Commission";

// Admin
export const getCommissions = async (c: Context) => {
  try {
    const commissions = await Commission.find();
    return c.json(
      {
        status: "success",
        results: commissions.length,
        data: {
          commissions,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error getting commissions:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get commissions",
      },
      500
    );
  }
};

export const getCommission = async (c: Context) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Commission ID is required",
        },
        400
      );
    }

    const commission = await Commission.findById(id);

    if (!commission) {
      return c.json(
        {
          status: "fail",
          message: "Commission not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        data: { commission },
      },
      200
    );
  } catch (error) {
    console.error("Error getting commission:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get commission",
      },
      500
    );
  }
};

export const deleteCommission = async (c: Context) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "Commission ID is required",
        },
        400
      );
    }

    const commission = await Commission.findByIdAndDelete(id);

    if (!commission) {
      return c.json(
        {
          status: "fail",
          message: "Commission not found",
        },
        404
      );
    }

    return c.json(
      {
        status: "success",
        message: "Commission deleted successfully",
      },
      200
    );
  } catch (error) {
    console.error("Error deleting commission:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to delete commission",
      },
      500
    );
  }
};

// Client
export const createCommission = async (c: Context) => {
  try {
    const { clientId, artistId, description, budget, dueDate } =
      await c.req.json();

    if (
      !clientId ||
      !artistId ||
      !description ||
      !budget ||
      !dueDate
    ) {
      return c.json(
        {
          status: "fail",
          message: "Please provide all required fields",
        },
        400
      );
    }

    const existingCommission = await Commission.findOne({
      clientId,
      artistId,
      description,
      status: { $ne: "Cancelled" },
    });
    if (existingCommission) {
      return c.json(
        {
          status: "fail",
          message: "A similar commission request already exists.",
        },
        400
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
        data: {
          commission,
        },
      },
      201
    );
  } catch (error) {
    console.error("Error creating commission:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to create commission",
      },
      500
    );
  }
};
export const getMyCommissions = async (c: Context) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json(
        {
          status: "fail",
          message: "ID is required",
        },
        400
      );
    }

    const commissions = await Commission.find({ clientId: id })
      .populate("artistId", "name email")
      .sort({ createdAt: -1 });

    return c.json(
      {
        status: "success",
        results: commissions.length,
        data: {
          commissions,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error getting client commissions:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get commissions",
      },
      500
    );
  }
};

export const respondToRenegotiation = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { action } = await c.req.json(); // action = 'accept' | 'decline'

    if (!action || !["accept", "decline"].includes(action)) {
      return c.json(
        {
          status: "fail",
          message: "Action must be either 'accept' or 'decline'",
        },
        400
      );
    }

    const commission = await Commission.findById(id).populate(
      "artistId",
      "name email"
    );

    if (!commission) {
      return c.json(
        { status: "fail", message: "Commission not found" },
        404
      );
    }

    if (commission.status !== "Pending_Approval") {
      return c.json(
        {
          status: "fail",
          message:
            "Commission is not in a state that allows renegotiation response",
        },
        400
      );
    }

    if (action === "accept") {
      commission.status = "In_Progress";
      await commission.save();

      return c.json(
        {
          status: "success",
          message: "Renegotiation accepted and commission updated",
          data: { commission },
        },
        200
      );
    } else {
      commission.status = "Cancelled";
      await commission.save();

      return c.json(
        {
          status: "success",
          message: "Renegotiation declined, commission cancelled",
          data: { commission },
        },
        200
      );
    }
  } catch (error) {
    console.error("Error responding to renegotiation:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to respond to renegotiation",
      },
      500
    );
  }
};

// Artist
export const getAssignedCommissions = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const commissions = await Commission.find({ artistId: id })
      .populate("clientId", "name email")
      .sort({ createdAt: -1 });

    return c.json(
      {
        status: "success",
        results: commissions.length,
        data: {
          commissions,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error getting assigned commissions:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to get assigned commissions",
      },
      500
    );
  }
};

export const acceptCommission = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const commission = await Commission.findById(id).populate(
      "clientId",
      "name email"
    );

    if (!commission) {
      return c.json(
        { status: "fail", message: "Commission not found" },
        404
      );
    }

    if (commission.status !== "Pending_Approval") {
      return c.json(
        {
          status: "fail",
          message:
            "Commission cannot be accepted in its current state",
        },
        400
      );
    }

    commission.status = "In_Progress";
    await commission.save();

    return c.json(
      {
        status: "success",
        message: "Commission accepted successfully",
        data: { commission },
      },
      200
    );
  } catch (error) {
    console.error("Error accepting commission:", error);
    return c.json(
      { status: "error", message: "Failed to accept commission" },
      500
    );
  }
};

export const declineCommission = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const commission = await Commission.findById(id).populate(
      "clientId",
      "name email"
    );

    if (!commission) {
      return c.json(
        { status: "fail", message: "Commission not found" },
        404
      );
    }

    if (commission.status !== "Pending_Approval") {
      return c.json(
        {
          status: "fail",
          message:
            "Commission cannot be declined in its current state",
        },
        400
      );
    }

    commission.status = "Cancelled";
    await commission.save();

    return c.json(
      {
        status: "success",
        message: "Commission declined successfully",
        data: { commission },
      },
      200
    );
  } catch (error) {
    console.error("Error declining commission:", error);
    return c.json(
      { status: "error", message: "Failed to decline commission" },
      500
    );
  }
};

export const renegotiateCommission = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { message, newBudget, newDueDate } = await c.req.json();

    if (!message) {
      return c.json(
        {
          status: "fail",
          message: "Renegotiation message is required",
        },
        400
      );
    }

    const commission = await Commission.findById(id).populate(
      "clientId",
      "name email"
    );

    if (!commission) {
      return c.json(
        { status: "fail", message: "Commission not found" },
        404
      );
    }

    if (commission.status !== "Pending_Approval") {
      return c.json(
        {
          status: "fail",
          message:
            "Commission cannot be renegotiated in its current state",
        },
        400
      );
    }

    if (commission.renegotiations.length > 0) {
      return c.json(
        {
          status: "fail",
          message:
            "A renegotiation is already pending. Wait for client response.",
        },
        400
      );
    }

    // Create renegotiation object
    const renegotiation = {
      message,
      budget: newBudget || commission.budget,
      dueDate: newDueDate || commission.dueDate,
      createdAt: new Date(),
    };

    // Add renegotiation to the commission
    commission.renegotiations.push(renegotiation);
    await commission.save();

    return c.json(
      {
        status: "success",
        message: "Renegotiation proposal sent successfully",
        data: { commission },
      },
      200
    );
  } catch (error) {
    console.error("Error renegotiating commission:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to renegotiate commission",
      },
      500
    );
  }
};

export const completeCommission = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const commission = await Commission.findById(id);

    if (!commission) {
      return c.json(
        {
          status: "fail",
          message: "Commission not found",
        },
        404
      );
    }

    if (commission.status !== "In_Progress") {
      return c.json(
        {
          status: "fail",
          message:
            "Commission is not in progress and cannot be completed",
        },
        400
      );
    }

    const updatedCommission = await Commission.findByIdAndUpdate(
      id,
      { status: "Completed" },
      { new: true }
    ).populate("clientId", "name email");

    return c.json(
      {
        status: "success",
        message: "Commission completed successfully",
        data: {
          commission: updatedCommission,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error completing commission:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to complete commission",
      },
      500
    );
  }
};
