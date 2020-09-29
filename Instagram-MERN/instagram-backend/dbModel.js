import mongoose from "mongoose";

const instance = mongoose.Schema({
  caption: String,
  image: String,
  username: String,
  comments: [],
});

export default mongoose.model("posts", instance);
