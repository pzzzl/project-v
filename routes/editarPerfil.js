const express = require("express");
const verificaToken = require("../middlewares/verificaToken");
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

router.get("/", verificaToken, async (req, res) => {
  let user = req.user;
  const client = await mongoClient.connect();
  let usersCollection = client.db("voidDatabase").collection("users");

  try {
    const result = await usersCollection.findOne({ _id: user });
    res.render("editarPerfil", {
      user: user,
      name: result.name,
      nickname: result.nickname,
      bornDate: result.bornDate,
      message: "",
      messageColor: "",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao buscar dados do usuário");
  } finally {
    if (client) await client.close();
  }
});

router.post("/", verificaToken,  async (req, res) => {
  let user = req.user;
  const { name, nickname, bornDate } = req.body;

  const client = await mongoClient.connect();
  let usersCollection = client.db("voidDatabase").collection("users");

  try {
    let resultado = await usersCollection.updateOne(
      { _id: user },
      { $set: { name: name, nickname: nickname, bornDate: bornDate } }
    );

    if (resultado.modifiedCount == 1 && resultado.matchedCount == 1) {
      res.render("editarPerfil", {
        user: user,
        name: name,
        nickname: nickname,
        bornDate: bornDate,
        message: "Dados alterados com sucesso!",
        messageColor: "darkgreen",
      });
    } else {
      res.render("editarPerfil", {
        user: user,
        name: name,
        nickname: nickname,
        bornDate: bornDate,
        message: "Os dados não foram alterados",
        messageColor: "darkred",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar dados do usuário");
  } finally {
    if (client) await client.close();
  }
});

module.exports = router;
