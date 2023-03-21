const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/verificaToken");
const isAdmin = require("../middlewares/isAdmin");
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

router.get("/", verificarToken, isAdmin, async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    const data = [];

    const cursor = usersCollection.find({ _id: { $ne: "admin" } });
    for await (const user of cursor) {
      data.push(user);
    }

    res.render("modificarUsuarios", { data });
  } catch (err) {
    console.log(err);
    res.send("Não foi possível buscar os usuários");
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

router.get("/:id", verificarToken, isAdmin, async (req, res) => {
  if (req.params.id == "admin")
    return res.send('Não é possível modificar o perfil "admin"');

  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    let data = await usersCollection.findOne({ _id: req.params.id });
    res.render("modificarUsuario", { data });
  } catch (err) {
    res.send(err.message);
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

router.post("/:id", verificarToken, isAdmin, async (req, res) => {
  const data = req.body;

  data.admin = data.admin == "true" ? true : false;

  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    let result = await usersCollection.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: data.name,
          nickname: data.nickname,
          bornDate: data.bornDate,
          admin: data.admin,
        },
      }
    );

    if (result) {
      data.message = "Atualizado com sucesso";
      res.render("modificarUsuario", { data });
    } else {
      res.send(`Não foi possível modificar o usuário ${req.params.id}`);
    }
  } catch (err) {
    res.send(err.message);
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
});

module.exports = router;
