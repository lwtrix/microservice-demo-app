import axios from "axios";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const events = []

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event)

  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "OK" });
});

app.get('/events', (req, res) => {
  res.send(events)
})

app.listen(4005, () => {
  console.log("EVENTS SERVICE: Live on port 4005");
});
