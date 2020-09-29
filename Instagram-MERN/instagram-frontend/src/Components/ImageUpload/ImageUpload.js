import { Button } from "@material-ui/core";
import React, { useState } from "react";
import "./ImageUpload.css";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import axios from "../../axios";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            axios.post("/upload", {
              caption: caption,
              image: url,
              username: username,
            });
            //posting the image inside
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              image: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageUpload">
      <input
        className="imageUpload__caption"
        type="text"
        placeholder="Write a Caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      {image && (
        <progress
          className="imageUpload__progress"
          value={progress}
          max="100"
        />
      )}

      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}> Upload</Button>
    </div>
  );
}

export default ImageUpload;
