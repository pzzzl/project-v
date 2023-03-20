const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const mongoClient = require("../database/database");
const formatDate = require("../functions/formatDate");
const { ObjectId } = require("mongodb");

router.get("/:id", verificaToken, async (req, res) => {
  const client = await mongoClient.connect();
  const rolesCollection = client.db("voidDatabase").collection("roles");

  let result = await rolesCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  result.dateRole = await formatDate(result.dateRole);
  res.render("exibirRole", { data: result });
});

module.exports = router;
