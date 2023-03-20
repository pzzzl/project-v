const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const formatDate = require("../functions/formatDate");
const getUserNickname = require("../functions/getUserNickname");
const mongoClient = require("../database/database");

router.get("/", verificaToken, async (req, res) => {
  let client;
  try {
    client = await mongoClient.connect();
    const rolesCollection = client.db("voidDatabase").collection("roles");

    const newListItems = [];

    const cursor = rolesCollection.find({});
    for await (const role of cursor) {
      const roleData = {
        id: role._id.toString(),
        nickname: await getUserNickname(role.user),
        nomeRole: role.nomeRole,
        localRole: role.localRole,
        descricaoRole: role.descricaoRole,
        dateRole: await formatDate(role.dateRole),
        timeRole: role.timeRole,
      };
      newListItems.push(roleData);
    }

    res.render("roles", { newListItems });
  } catch (err) {
    console.error(err);
    res.send("Erro ao buscar os rolês");
  } finally {
    if (client) await client.close();
  }
});

module.exports = router;
