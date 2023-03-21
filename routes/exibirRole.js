const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const formatDate = require("../functions/formatDate");
const getUserNickname = require("../functions/getUserNickname");

router.get("/:id", verificaToken, async (req, res) => {
  let client;
  try {
    client = await mongoClient.connect();
    const rolesCollection = client.db("voidDatabase").collection("roles");
    const usersCollection = client.db("voidDatabase").collection("users");

    let result = await rolesCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    result.dateRole = await formatDate(result.dateRole);
    result.nickname = await getUserNickname(result.user, usersCollection);
    let participants = "";

    if (result.participantsRole.length == 0) {
      participants = "";
    } else if (result.participantsRole.length == 1) {
      participants = await getUserNickname(
        result.participantsRole[0],
        usersCollection
      );
    } else {
      for await (const participant of result.participantsRole) {
        participants += `${await getUserNickname(
          participant,
          usersCollection
        )} • `;
      }
      participants = participants.replace(new RegExp(" • $"), "");
    }

    result.participantsRole = participants;

    res.render("exibirRole", { data: result });
  } catch (err) {
    res.send(err.message);
  } finally {
    if (client) await client.close();
  }
});

module.exports = router;
