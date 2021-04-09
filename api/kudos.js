const url = require("url");
const MongoClient = require("mongodb").MongoClient;

let cachedDb = null;

async function connect(uri) {

  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = await client.db(url.parse(uri).pathname.substr(1))

  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  const db = await connect(process.env.MONGODB_URI)
  const id = req.query.id;

  // Don't allow the use of curl.
  if (req.headers["user-agent"].includes("curl")) {
    res.status(403).json({ error: "hey there, chill" });
    return;
  }

  const kudos = db.collection("kudos");
  const existing = await kudos.find({ referer: req.headers.referer, id: id }).toArray();

  let count;
  if (!existing.length) {
    count = 0;
    const initial = await kudos.insertOne({ referer: req.headers.referer, id: id, count: count });
  } else {
    const toUpdate = existing[0];
    count = toUpdate.count + 1;
    const updated = await kudos.updateOne({ referer: req.headers.referer, id: id }, { $set: { count: count }});
  }

  res.status(200).json({ count: count });
};