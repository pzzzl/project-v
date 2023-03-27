const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

router.get("/", verificaToken, async (req, res) => {
  let user = req.user;

  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    const result = await usersCollection.findOne({ _id: user });
    res.render("perfil", { data: { user: user, admin: result.admin, picture: result.picture } });
  } catch {
    res.send("Não foi possível acessar o perfil");
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

module.exports = router;
