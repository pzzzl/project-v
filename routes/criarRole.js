const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const mongoClient = require("../database/database");

router.get("/", verificaToken, (req, res) => {
  res.render("criarRole");
});

router.post("/", verificaToken, async (req, res) => {
  const { user } = req;
  const { nomeRole, localRole, descricaoRole, dateRole, timeRole } = req.body;
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
    });

    client.close();

    res.status(201).send("<script>document.location = '/roles'</script>");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar rolê");
  }
});

module.exports = router;
