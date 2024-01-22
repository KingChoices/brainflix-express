const express = require("express");
const app = express();
const cors = require("cors");
const uniqid = require("uniqid");

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(express.static("public/assets/images/"));

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "./data/video-details.json");

app.use(
  "/images",
  express.static(path.join(__dirname, "./public/assets/images/"))
);

app.get("/videos", (req, res) => {
  function getVideos(data) {
    const videosJson = fs.readFileSync(data);

    return JSON.parse(videosJson);
  }
  res.json(getVideos(filePath));
});

app.get("/videos/:videoId", (req, res) => {
  function getVideos(data) {
    const videosJson = fs.readFileSync(data);

    return JSON.parse(videosJson);
  }

  const videoId = req.params.videoId;
  const videos = getVideos(filePath);
  console.log("requested id: ", videoId);

  const foundVideo = videos.find((video) => video.id === videoId);
  console.log("found video", foundVideo);

  if (foundVideo) {
    res.json(foundVideo);
  } else {
    res.status(404).json({ error: "Video not found" });
  }
});

app.post("/videos", (req, res) => {
  const newVideo = {
    id: uniqid(),
    title: req.body.title,
    channel: "Ben Carls",
    image: "./public/assets/images/img-1.jpg",
    description: req.body.desc,
    views: "388,293",
    likes: "1392",
    duration: "3:33",
    video: "https://project-2-api.herokuapp.com/stream",
    timeStamp: "294877290",
    comments: [
      {
        id: uniqid(),
        name: "Peter Parker",
        comment:
          "Fantastic video, I love the quality and the smooth transitions.",
        like: "0",
        timeStamp: "409832087",
      },
      {
        id: uniqid(),
        name: "Bruce Wayne",
        comment: "Woahhhh amazing video!!! I absolutely love :D.",
        like: "0",
        timeStamp: "245878384",
      },
      {
        id: uniqid(),
        name: "Ben Ten",
        comment:
          "Quality: 10/10, Transitions: 10/10, My love for the video <3 10/10.",
        like: "0",
        timeStamp: "458998332",
      },
    ],
  };

  console.log(newVideo);

  function readJSON() {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const parsedJson = JSON.parse(jsonData);
    return parsedJson;
  }

  const data = readJSON();
  data.push(newVideo);
  fs.writeFileSync(filePath, JSON.stringify(data));

  res.json({
    success: true,
    message: "Video added successfully",
    video: newVideo,
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
