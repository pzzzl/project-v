const express = require("express");
const verificaToken = require("../middlewares/verificaToken");
const router = express.Router();
const mongoClient = require("../database/database");
const calcAge = require("../functions/calcAge");

router.get("/", verificaToken, async (req, res) => {
  try {
    const client = await mongoClient.connect();
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
  }
});

module.exports = router;
