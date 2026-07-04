import express from "express";
import cors from "cors";
import { clerkAuth } from "./middlewares/require-auth";
import messageHistoryRouter from "./routes/message-history.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkAuth); // attaches req.auth for every route

app.use(messageHistoryRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;