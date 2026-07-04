import { User } from "../models/user.js";

export async function getOrCreateUser(profile) {
  const existing = await User.findOne({ clerkId: profile.clerkId });
  if (existing) return existing;

  return User.create({
    clerkId: profile.clerkId,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
  });
}