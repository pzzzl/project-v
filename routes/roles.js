const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
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
        nickname: await getUserNickname(role.user),
        nomeRole: role.nomeRole,
        localRole: role.localRole,
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
    client.close();
  }
});

async function getUserNickname(userId) {
  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    const userFound = await usersCollection.findOne({ _id: userId });
    return userFound.nickname;
  } catch (err) {
    console.error(err);
    return "Usuário não encontrado";
  }
}

async function formatDate(input) {
  if (input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0], // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + "/" + month + "/" + year;
  } else {
    return "";
  }
}

module.exports = router;
