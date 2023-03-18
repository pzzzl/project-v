/** Roteador Express para exibir uma lista de roles.
 * @module routes/roles
 */
const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const mongoClient = require("../database/database");

/** Rota para exibir uma lista de roles.
 * @name GET /
 * @function
 * @memberof module:routes/roles
 * @param {Object} req - Objeto de solicitação HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 * @param {function} next - Função callback para chamar o próximo middleware.
 * @throws {Error} Se não houver token no cookie ou o token não for válido.
 */
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

/** Retorna o nickname do usuário com base no id do usuário.
 * @async
 * @function
 * @memberof module:routes/roles
 * @param {string} userId - O id do usuário.
 * @returns {Promise<string>} O nickname do usuário.
 */
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

/** Formata a data em uma string no formato "DD/MM/AAAA".
 * @async
 * @function
 * @memberof module:routes/roles
 * @param {Date} date - A data a ser formatada.
 * @returns {Promise<string>} A data formatada em uma string.
 */
async function formatDate(date) {
  if (date) {
    var datePart = date.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return day + "/" + month + "/" + year;
  } else {
    return "";
  }
}

module.exports = router;
