const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const mongoClient = require("../database/database");
const formatDate = require("../functions/formatDate");
const getUserNickname = require("../functions/getUserNickname");
const { ObjectId } = require("mongodb");

router.get("/:id", verificaToken, async (req, res) => {
  const client = await mongoClient.connect();
  const rolesCollection = client.db("voidDatabase").collection("roles");

  let result = await rolesCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  result.dateRole = await formatDate(result.dateRole);
  result.nickname = await getUserNickname(result.user);
  res.render("exibirRole", { data: result });
});

module.exports = router;
