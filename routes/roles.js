const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const formatDate = require("../functions/formatDate");
const getUserNickname = require("../functions/getUserNickname");
const getParticipantsRole = require("../functions/getParticipantsRole");
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

router.get("/", verificaToken, async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const rolesCollection = client.db("voidDatabase").collection("roles");
    const usersCollection = client.db("voidDatabase").collection("users");

    const newListItems = [];

    const cursor = rolesCollection.find({});
    for await (const role of cursor) {
      const roleData = {
        id: role._id.toString(),
        nickname: await getUserNickname(role.user, usersCollection),
        nomeRole: role.nomeRole,
        localRole: role.localRole,
        descricaoRole: role.descricaoRole,
        dateRole: await formatDate(role.dateRole),
        timeRole: role.timeRole,
        participantsRole: await getParticipantsRole(role._id, rolesCollection),
      };
      newListItems.push(roleData);
    }

    res.render("roles", { newListItems });
  } catch (err) {
    console.error(err);
    res.send(" Erro ao buscar os rolês ");
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

module.exports = router;
