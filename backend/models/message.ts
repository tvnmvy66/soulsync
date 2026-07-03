import * as mongoose from "mongoose";

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

    messages: [
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
    ],
  },
  {
    timestamps: true,
  }
);

export type Message = mongoose.InferSchemaType<typeof messageSchema>;

export const Message = mongoose.model("Message", messageSchema);