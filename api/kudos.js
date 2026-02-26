const url = require("url");
const MongoClient = require("mongodb").MongoClient;

let cachedDb = null;
const DB_NAME = process.env.MONGODB_URI
  ? url.parse(process.env.MONGODB_URI).pathname.substr(1)
  : null;

async function connect(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = await client.db(url.parse(uri).pathname.substr(1));

  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const userAgent = req.headers["user-agent"] || "";
  const referer = req.headers.referer || null;
  const idsRaw = req.query.ids || "";
  const ids = idsRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  console.log(`[kudos:${requestId}] request`, {
    method: req.method,
    ids,
    add: req.query.add || null,
    referer,
    dbName: DB_NAME,
  });

  // Don't allow the use of curl.
  if (userAgent.includes("curl")) {
    console.log(`[kudos:${requestId}] blocked curl user-agent`);
    res.status(403).json({ error: "hey there, chill" });
    return;
  }

  if (!ids.length) {
    console.log(`[kudos:${requestId}] missing ids query param`);
    res.status(400).json({ error: "missing ids query param" });
    return;
  }

  try {
    const db = await connect(process.env.MONGODB_URI);
    const kudos = db.collection("kudos");
    const existing = await kudos
      .find({ referer: referer, id: { "$in": ids } })
      .toArray();
    const existingIds = existing.map((e) => e.id);
    const newKudos = ids.filter((id) => {
      return !existingIds.includes(id);
    });

    console.log(`[kudos:${requestId}] query`, {
      requestedIds: ids.length,
      existingIds: existing.length,
      newIds: newKudos.length,
      matchedReferer: referer,
    });

    let data = {};
    if (req.query.add) {
      const operations = existing.map((kudo) => {
        const count = kudo.count + parseInt(req.query.add);
        data[kudo.id] = count;
        return { updateOne: { filter: { referer: referer, id: kudo.id }, update: { $set: { count: count } } } };
      });
      if (operations.length) {
        await kudos.bulkWrite(operations);
      }
      console.log(`[kudos:${requestId}] updated`, {
        add: parseInt(req.query.add),
        docsUpdated: operations.length,
      });
    } else {
      existing.forEach((kudo) => {
        data[kudo.id] = kudo.count;
      });
    }

    if (newKudos.length) {
      const createOperations = newKudos.map((newKudo) => {
        const count = 0;
        const kudo = { referer: referer, id: newKudo, count: count };
        data[newKudo] = count;
        return { insertOne: kudo };
      });
      await kudos.bulkWrite(createOperations);
      console.log(`[kudos:${requestId}] inserted`, {
        docsInserted: createOperations.length,
      });
    }

    console.log(`[kudos:${requestId}] response`, { data });
    res.status(200).json(data);
  } catch (error) {
    console.error(`[kudos:${requestId}] error`, {
      message: error.message,
      stack: error.stack,
      dbName: DB_NAME,
      referer,
      ids,
    });
    res.status(500).json({ error: "internal server error" });
  }
};
