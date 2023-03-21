const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

router.get("/", verificaToken, (req, res) => {
  res.render("criarRole");
});

router.post("/novoRole", verificaToken, async (req, res) => {
  const { user } = req;
  const { nomeRole, localRole, descricaoRole, dateRole, timeRole } = req.body;
  const participantsRole = [user];

  try {
    const client = await mongoClient.connect();
    const rolesCollection = client.db("voidDatabase").collection("roles");
    await rolesCollection.insertOne({
      user,
      nomeRole,
      localRole,
      descricaoRole,
      dateRole,
      timeRole,
      participantsRole,
    });

    res.redirect("/roles")
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar rolê");
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

module.exports = router;
