/** Express router para gerenciar rotas relacionadas a criação de rolês.
@module routes/roles
@requires express
@requires ../middlewares/verificaToken
@requires ../database/database
*/
const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const mongoClient = require("../database/database");

/** Rota GET para renderizar a página de criação de rolê.
@name get/roles
@function
@memberof module:routes/roles
@inner
@param {object} req - Objeto da requisição.
@param {object} res - Objeto da resposta.
@param {function} next - Função callback para chamar o próximo middleware.
@return {Promise<void>} A página 'criarRole'.
*/
router.get("/", verificaToken, (req, res) => {
  res.render("criarRole");
});

/** Rota POST para criar um novo rolê.
@name post/roles
@function
@memberof module:routes/roles
@inner
@async
@param {object} req - Objeto da requisição.
@param {object} req.user - Objeto contendo informações do usuário autenticado.
@param {object} req.body - Objeto contendo os dados do novo rolê.
@param {string} req.body.nomeRole - Nome do rolê a ser criado.
@param {string} req.body.localRole - Local onde o rolê ocorrerá.
@param {string} req.body.descricaoRole - Descrição do rolê.
@param {string} req.body.dateRole - Data do rolê.
@param {string} req.body.timeRole - Hora do rolê.
@param {object} res - Objeto da resposta.
@return {Promise<void>} Mensagem de sucesso ou erro na criação do rolê.
*/
router.post("/", verificaToken, async (req, res) => {
  const { user } = req;
  const { nomeRole, localRole, descricaoRole, dateRole, timeRole } = req.body;
  try {
    const client = await mongoClient.connect();
    const rolesCollection = client.db("voidDatabase").collection("roles");
    await rolesCollection.insertOne({
      user,
      nomeRole,
      localRole,
      descricaoRole,
      dateRole,
      timeRole,
    });

    client.close();

    res.status(201).send("<script>document.location = '/roles'</script>");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar rolê");
  }
});

module.exports = router;
