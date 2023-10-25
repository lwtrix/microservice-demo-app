import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "COMMENT_CREATED") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    setTimeout(async () => {
      await axios.post("http://localhost:4005/events", {
        type: "COMMENT_MODERATED",
        data: { ...data, status },
      });
    }, 10000);
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("MODERATION SERVICE: Live on port 4003");
});
