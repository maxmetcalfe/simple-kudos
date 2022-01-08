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
  const ids = req.query.ids;

  res.setHeader("Access-Control-Allow-Origin", "*");

  // Don't allow the use of curl.
  if (req.headers["user-agent"].includes("curl")) {
    res.status(403).json({ error: "hey there, chill" });
    return;
  }

  let data = {};
  const kudos = db.collection("kudos");
  const existing = await kudos.find({ referer: req.headers.referer, "id": { "$in": ids.split(",") }}).toArray();
  const existingIds = existing.map(e => e.id);
  const newKudos = ids.split(",").filter((id) => {
    return !existingIds.includes(id);
  })

  if (req.query.add) {
    const operations = existing.map((kudo) => {
      const count = kudo.count + parseInt(req.query.add);
      data[kudo.id] = count;
      return { updateOne: { filter: { referer: req.headers.referer, id: kudo.id }, update: { $set: { count: count}}}}
    })
    if (operations.length) {
      await kudos.bulkWrite(operations);
    }
  } else {
      existing.forEach((kudo) => {
        data[kudo.id] = kudo.count;
    })
  }
  
  if (newKudos) {
    const createOperations = newKudos.map((newKudo) => {
      const count = 0;
      const kudo = { referer: req.headers.referer, id: newKudo, count: count };
      data[newKudo] = count;
      return { insertOne: kudo};
    })
    if (createOperations.length) {
      await kudos.bulkWrite(createOperations);
    }
  }

  res.status(200).json(data);
};
