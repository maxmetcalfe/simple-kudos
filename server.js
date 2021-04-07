const express = require("express");
const app = express();

// Temp.
let kudos = {};

app.use(express.static("static"))

app.get("/kudos", (req, res) => {
  const host = req.get("host");
  const id = req.query.id;

  // Don't allow the use of curl.
  if (req.headers["user-agent"].includes("curl")) {
    res.status(403).json({ error: "hey there, chill" });
    return;
  }

  if (Object.keys(kudos).indexOf(id) === -1) {
    kudos[id] = 0;
    // res.status(500).json({ error: "The provided simple-kudos ID does not exist." });
    //return;
  }

  if (req.query.add) {
    kudos[id] = kudos[id] + parseInt(req.query.add);
  }

  res.status(200).json({ count: kudos[id] });
});

app.get("/__debug", (req, res) => {
  res.status(200).json(kudos);
})

app.listen(3000, () => console.log("Listening on port 3000!"));
