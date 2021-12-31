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
let messages = [welcomeMessage];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages/search", (req, res) => {
  const filteredSearch = messages.filter((message) => {
    if (message.text.includes(req.query.term)) {
      return true;
    } else {
      return false;
    }
  });
  res.json(filteredSearch);
});

app.get("/messages/searchID", (req, res) => {
  res.json(messages.find((message) => message.id == req.query.id));
});

app.delete("/messages/searchID", (req, res) => {
  messages = messages.filter((message) => message.id !== req.query.id);
});

app.post("/messages", (req, res) => {
  const validated = req.body.from != "" && req.body.text != "";
  if (validated) {
    ++currentMessageID;
    //setup date and time:
    //date:
    const d = new Date();
    const currentDay = d.getDate();
    const currentMonth = d.getMonth() + 1; // has to be +1 due to
    const currentYear = d.getFullYear(); // the months starting at 0 instead of 1
    //time:
    const hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
    const minute = d.getMinutes();
    const storedTimeSent = `${currentDay}/${currentMonth}/${currentYear}/${hour}:${minute}`;

    //modify array:
    messages.push({
      id: currentMessageID,
      from: req.body.from,
      text: req.body.text,
      timeSent: storedTimeSent,
    });
  } else {
    res.status(400).send("invalid field");
  }
});
app.get("/messages", (req, res) => {
  res.json(messages);
});

app.listen(process.env.PORT);
