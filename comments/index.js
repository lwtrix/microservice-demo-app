import express from "express";
import { randomBytes } from "crypto";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});
app.post("/posts/:id/comments", (req, res) => {
  const commId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const commentsArr = commentsByPostId[req.params.id] || [];

  commentsArr.push({ id: commId, content: content });
  commentsByPostId[req.params.id] = commentsArr;

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.listen(4001, () => {
  console.log("Live on port 4001");
});
