import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);