import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { getOrCreateUser } from "../services/user.services.js";
import { getHistory } from "../services/message.services.js";
import { isPersonaId } from "../types/persona.js";

const router = Router();

// GET /message-history?personaId=...
router.get("/message-history", async (req, res) => {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { personaId } = req.query;

  if (typeof personaId !== "string" || !isPersonaId(personaId)) {
    return res.status(400).json({
      error: "personaId must be one of: piyush-garg, hitesh-choudhary.",
    });
  }

  try {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    const user = await getOrCreateUser({
      clerkId: clerkUser.id,
      name:
        `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
        "Anonymous",
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      avatar: clerkUser.imageUrl,
    });

    const history = await getHistory(user._id, personaId);
    res.json(history);
  } catch (error) {
    console.error("[message-history] failed:", error);
    res.status(500).json({ error: "Failed to load message history." });
  }
});

export default router;