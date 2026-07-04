import { verifyToken } from "@clerk/backend";

export async function socketAuthMiddleware(
  socket,
  next
) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) throw new Error("Missing auth token");

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    socket.data.clerkId = verified.sub;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}