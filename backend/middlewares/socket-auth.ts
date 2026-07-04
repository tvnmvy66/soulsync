import type { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";
import { verifyToken } from "@clerk/backend";

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  try {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) throw new Error("Missing auth token");

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    socket.data.clerkId = verified.sub;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}