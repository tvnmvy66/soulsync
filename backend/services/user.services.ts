import { User } from "../models/user";

interface ClerkProfile {
  clerkId: string;
  name: string;
  email: string;
  avatar?: string;
}

export async function getOrCreateUser(profile: ClerkProfile) {
  const existing = await User.findOne({ clerkId: profile.clerkId });
  if (existing) return existing;

  return User.create({
    clerkId: profile.clerkId,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
  });
}