const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const formatDate = require("../functions/formatDate");
const getUserNickname = require("../functions/getUserNickname");
const getParticipantsRole = require("../functions/getParticipantsRole");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const getUserParticipationOnRole = require("../functions/getUserParticipationOnRole");

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
      
      let participation = await getUserParticipationOnRole(
        req.user,
        role._id,
        rolesCollection
      );
      const roleData = {
        id: role._id.toString(),
        nickname: await getUserNickname(role.user, usersCollection),
        nomeRole: role.nomeRole,
        localRole: role.localRole,
        descricaoRole: role.descricaoRole,
        dateRole: await formatDate(role.dateRole),
        timeRole: role.timeRole,
        participantsRoleCount: await getParticipantsRole(
          role._id,
          rolesCollection
        ),
        userConfirmedRole: participation,
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

router.post("/:id", verificaToken, async (req, res) => {

  try {
    const client = await mongoClient.connect();
    const rolesCollection = client.db("voidDatabase").collection("roles");

    await rolesCollection
      .findOne({
        _id: new ObjectId(req.params.id),
        participantsRole: { $in: [req.user] },
      })
      .then(async (result) => {
        // Se o usuário não tiver incluído no rolê
        if (!result) {
          await rolesCollection
            .findOneAndUpdate(
              { _id: new ObjectId(req.params.id) },
              { $push: { participantsRole: req.user } }
            )
            .then((result) => {
              res.redirect("/roles");
            })
            .catch((err) => {
              console.error(err);
              res.render(
                "Não foi possível encontrar o usuário no rolê<script>function redirect() {document.location='/roles'}setTimeout(redirect, 3000)</script>"
              );
            });
        } else {
          // Se o usuário estiver incluído no rolê
          await rolesCollection
            .findOneAndUpdate(
              { _id: new ObjectId(req.params.id) },
              { $pull: { participantsRole: req.user } }
            )
            .then((result) => {
              res.redirect("/roles");
            })
            .catch((err) => {
              console.error(err);
              res.render(
                "Não foi possível remover participação do rolê<script>function redirect() {document.location='/roles'}setTimeout(redirect, 3000)</script>"
              );
            });
        }
      });
  } catch (err) {
    console.error(err);
    res.send(
      "Não foi possível confirmar participação no rolê<script>function redirect() {document.location='/roles'}setTimeout(redirect, 3000)</script>"
    );
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

module.exports = router;
