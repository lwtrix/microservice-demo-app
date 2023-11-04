import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "POST_CREATED") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "COMMENT_CREATED") {
    const { postId } = data;

    posts[postId].comments.push(data);
  }

  if (type === "COMMENT_UPDATED") {
    const { postId, id, content, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comm) => comm.id === id);

    comment.content = content;
    comment.status = status;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Received event: ", type);

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("QUERY SERVICE: Live on port 4002");

  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing event: ", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log(err.message);
  }
});
