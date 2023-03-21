const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

router.get("/", (req, res) => {
  res.render("cadastro", { user: null, className: "hiddenClass" });
});

router.post("/", async (req, res) => {
  const { user, password, name, nickname, bornDate } = req.body;
  let client;
  try {
    client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");
    const existingUser = await usersCollection.findOne({ _id: user });

    if (existingUser) {
      return res.render("cadastro", { user: user, className: "" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      _id: user.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      nickname: nickname.trim(),
      bornDate: bornDate,
      admin: false,
    });

    res.status(201).render("usuarioCadastradoComSucesso", { user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor");
  } finally {
    if (client) await client.close(true);
  }
});

module.exports = router;
