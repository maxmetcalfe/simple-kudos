const express = require("express");
const app = express();

app.use(express.static("static"))

const PORT = process.env.PORT || 2005;
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
