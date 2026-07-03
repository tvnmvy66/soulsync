import express from "express";
import { User } from "./models/user";

const app = express();

app.use(express.json());

app.get("/",async (_, res) => {
  res.send("Hello World!");
});

export default app;