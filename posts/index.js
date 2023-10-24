import express from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  const newPost = { id, title };
  posts[id] = newPost;

  const eventToSend = { type: "POST_CREATED", data: newPost };
  await axios.post("http://localhost:4005/events", eventToSend);

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log(`Event received: ${req.body.type}`);

  res.send({});
});

app.listen("4000", () => {
  console.log("POSTS SERVICE: Live on port 4000");
});
