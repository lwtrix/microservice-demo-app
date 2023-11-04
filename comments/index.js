import express from "express";
import { randomBytes } from "crypto";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});
app.post("/posts/:id/comments", async (req, res) => {
  const commId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const commentsArr = commentsByPostId[req.params.id] || [];
  const newComment = {
    id: commId,
    content: content,
    postId: req.params.id,
    status: "pending",
  };

  commentsArr.push(newComment);
  commentsByPostId[req.params.id] = commentsArr;

  const eventToSend = { type: "COMMENT_CREATED", data: newComment };
  await axios.post("http://event-bus-srv:4005/events", eventToSend);

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log(`Event received: ${type}`);

  if (type === "COMMENT_MODERATED") {
    const { postId, id, status, content } = data;
    const commentsArr = commentsByPostId[postId];

    const comment = commentsArr.find((comm) => comm.id === id);

    comment.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "COMMENT_UPDATED",
      data: {
        id,
        status,
        content,
        postId,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("COMMENTS SERVICE: Live on port 4001");
});
