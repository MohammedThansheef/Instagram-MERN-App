import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dbModel from "./dbModel.js";
import Pusher from "pusher";

//app config
const app = express();
const port = process.env.PORT || 8080;

const pusher = new Pusher({
  appId: "1081429",
  key: "26d03122773d3aabc9ad",
  secret: "90ccde6d0bcab4d885be",
  cluster: "ap2",
  usetls: true,
});

//middlewares
app.use(express.json());
app.use(cors());

///Db config
const connection_url =
  "mongodb+srv://admin:Y9nfVszMBPKuqNXG@cluster0.xoxiy.mongodb.net/instaDB?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log(" Db is connected");

  const changeStream = mongoose.connection.collection("posts").watch();

  changeStream.on("change", (change) => {
    console.log("Triggered the change on pusher");
    console.log(change);

    if (change.operationType === "insert") {
      const postDetails = change.fullDocument;

      pusher.trigger("posts", "inserted", {
        caption: postDetails.caption,
        image: postDetails.image,
        username: postDetails.username,
      });
    } else {
      console.log("Error triggering in Pusher");
    }
  });
});

// api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

app.post("/upload", (req, res) => {
  const body = req.body;

  dbModel.create(body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/sync", (req, res) => {
  dbModel.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
//listener
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
