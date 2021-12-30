const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let currentMessageID = 0;

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages/searchID", (req, res) => {
  res.json(messages.find((message) => message.id == req.query.id));
});

app.post("/messages", (req, res) => {
  const validated = req.body.from != "" && req.body.text != "";
  if (validated) {
    ++currentMessageID;
    messages.push({
      id: currentMessageID,
      from: req.body.from,
      text: req.body.text,
    });
  } else {
    res.status(400).send("invalid field");
  }
});
app.get("/messages", (req, res) => {
  res.json(messages);
});

app.listen(process.env.PORT);
