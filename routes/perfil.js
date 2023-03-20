const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const mongoClient = require("../database/database");

router.get("/", verificaToken, async (req, res) => {
  let user = req.user;

  let client;

  try {
    client = await mongoClient.connect();
    let usersCollection = client.db("voidDatabase").collection("users");

    let result = await usersCollection.findOne({ _id: user });
    res.render("perfil", { data: { user: user, admin: result.admin } });
  } catch {
    res.send("Não foi possível acessar o perfil");
  } finally {
    client.close();
  }
});

module.exports = router;
