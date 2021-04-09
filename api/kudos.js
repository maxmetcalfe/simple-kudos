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

  res.setHeader("Access-Control-Allow-Origin", "*");

  // Don't allow the use of curl.
  if (req.headers["user-agent"].includes("curl")) {
    res.status(403).json({ error: "hey there, chill" });
    return;
  }

  const kudos = db.collection("kudos");
  const existing = await kudos.find({ referer: req.headers.referer, id: id }).toArray();

  let count;
  let toUpdate = existing.length ? existing[0] : null;

  if (!existing.length) {
    count = 0;
    const initial = await kudos.insertOne({ referer: req.headers.referer, id: id, count: count });
  } else if (req.query.add) {
    count = toUpdate.count + req.query.add;
    const updated = await kudos.updateOne({ referer: req.headers.referer, id: id }, { $set: { count: count }});
  } else {
    count = toUpdate.count;
    const updated = await kudos.updateOne({ referer: req.headers.referer, id: id }, { $set: { count: count }});
  }

  res.status(200).json({ count: count });
};
