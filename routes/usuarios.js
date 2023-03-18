/** Rota para buscar e renderizar a lista de usuários.
 * @module routes/usuarios
 */
const express = require("express");
const verificaToken = require("../middlewares/verificaToken");
const router = express.Router();
const mongoClient = require("../database/database");

/**
 * @typedef User
 * @type {Object}
 * @property {string} nickname - O apelido do usuário.
 * @property {string} name - O nome completo do usuário.
 * @property {number} age - A idade do usuário.
 */

/** Função para calcular a idade com base na data de nascimento.
 * @function
 * @param {string} bornDate - A data de nascimento no formato "yyyy-mm-dd".
 * @returns {number} A idade em anos.
 */
function calcAge(bornDate) {
  var today = new Date();
  var birthDate = new Date(bornDate);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/** Rota GET para buscar e renderizar a lista de usuários.
 * @name get/usuarios
 * @function
 * @memberof module:routes/usuarios
 * @param {Object} req - O objeto de solicitação HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {function} next - A próxima função de middleware na cadeia.
 * @throws {Error} - Se ocorrer um erro ao buscar usuários no banco de dados.
 * @returns {Promise} - Uma promessa que resolve para a lista de usuários renderizada.
 */
router.get("/", verificaToken, async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    const cursor = usersCollection.find({ _id: { $ne: "admin" } });
    const users = await cursor.toArray();
    const newListItems /** @type {User[]} */ = users.map((userFound) => ({
      nickname: userFound.nickname,
      name: userFound.name,
      age: calcAge(userFound.bornDate),
    }));

    res.render("usuarios", { newListItems });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Erro ao buscar os usuários: ${err.message}`);
  }
});

module.exports = router;
