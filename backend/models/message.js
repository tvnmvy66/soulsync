import * as mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    persona: {
      type: String,
      enum: ["piyush-garg", "hitesh-choudhary"],
      required: true,
    },

    messages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ user: 1, persona: 1 }, { unique: true });

export const Message = mongoose.model("Message", messageSchema);