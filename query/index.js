import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "POST_CREATED") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
    console.log(posts);
  }

  if (type === "COMMENT_CREATED") {
    const { postId } = data;

    posts[postId].comments.push(data);
    console.log(posts);
  }

  if (type === "COMMENT_UPDATED") {
    const { postId, id, content, status } = data;
    const post = posts[postId]
    const comment = post.comments.find(comm => (
        comm.id === id
    ))

    comment.content = content
    comment.status = status

    console.log(posts);
  }

  res.send({});
});

app.listen(4002, () => {
  console.log("QUERY SERVICE: Live on port 4002");
});
