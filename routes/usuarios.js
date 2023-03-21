const express = require("express");
const verificaToken = require("../middlewares/verificaToken");
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const calcAge = require("../functions/calcAge");

router.get("/", verificaToken, async (req, res) => {
  let client;
  try {
    client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    const cursor = usersCollection.find({ _id: { $ne: "admin" } });
    const users = await cursor.toArray();
    const newListItems /** @type {User[]} */ = users.map((userFound) => ({
      nickname: userFound.nickname,
      name: userFound.name,
      age: calcAge(userFound.bornDate),
    }));

    res.render("usuarios", { newListItems });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Erro ao buscar os usuários: ${err.message}`);
  } finally {
    if (client) await client.close();
  }
});

module.exports = router;
