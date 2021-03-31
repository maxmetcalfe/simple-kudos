const express = require("express");
const app = express();

let kudos = {};

app.use(express.static("static"))
app.get("/kudos", (req, res) => {
  console.log(req.query.id);
  const id = req.query.id;
  if (Object.keys(kudos).indexOf(id) === -1) {  
    kudos[id] = 0;
  } else {
    kudos[id]++;
  }
  res.status(200).json({ count: kudos[id] });
})

app.listen(3000, () => console.log("Listening on port 3000!"));
