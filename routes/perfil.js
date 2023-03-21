const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const mongoClient = require("../database/database");

router.get("/", verificaToken, async (req, res) => {
  let user = req.user;

  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    const result = await usersCollection.findOne({ _id: user });
    res.render("perfil", { data: { user: user, admin: result.admin } });
  } catch {
    res.send("Não foi possível acessar o perfil");
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

module.exports = router;
