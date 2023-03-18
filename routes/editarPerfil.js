/** Importa o framework Express
@const {object} express
*/
const express = require("express");

/** Importa a função verificaToken do middleware
@const {function} verificaToken
*/
const verificaToken = require("../middlewares/verificaToken");

/** Cria um roteador utilizando o framework Express
@const {object} router
*/
const router = express.Router();

/** Importa o cliente do MongoDB
@const {object} mongoClient
*/
const mongoClient = require("../database/database");

/** Trata a requisição GET na rota "/"
@function get
@param {string} path - a URL raiz da rota
@param {function} middleware - o middleware verificaToken
@param {function} middleware - a função assíncrona que trata a requisição GET
@param {object} req - objeto da requisição HTTP
@param {object} req.user - objeto que representa o usuário logado
@param {object} res - objeto da resposta HTTP
@returns {Promise} Promessa contendo a resposta da página "editarPerfil"
*/
router.get("/", verificaToken, async (req, res) => {
  let user = req.user;
  const client = await mongoClient.connect();
  let usersCollection = client.db("voidDatabase").collection("users");

  try {
    const result = await usersCollection.findOne({ _id: user });
    res.render("editarPerfil", {
      user: user,
      name: result.name,
      nickname: result.nickname,
      bornDate: result.bornDate,
      message: "",
      messageColor: "",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao buscar dados do usuário");
  } finally {
    client.close();
  }
});

/** Trata a requisição POST na rota "/"
@function post
@param {string} path - a URL raiz da rota
@param {function} middleware - o middleware verificaToken
@param {function} middleware - a função assíncrona que trata a requisição POST
@param {object} req - objeto da requisição HTTP
@param {object} req.user - objeto que representa o usuário logado
@param {object} req.body - objeto que representa o corpo da requisição HTTP
@param {string} req.body.name - nome do usuário
@param {string} req.body.nickname - apelido do usuário
@param {string} req.body.bornDate - data de nascimento do usuário
@param {object} res - objeto da resposta HTTP
@returns {Promise} Promessa contendo a resposta da página "editarPerfil"
*/
router.post("/", verificaToken, async (req, res) => {
  let user = req.user;
  const { name, nickname, bornDate } = req.body;

  const client = await mongoClient.connect();
  let usersCollection = client.db("voidDatabase").collection("users");

  try {
    let resultado = await usersCollection.updateOne(
      { _id: user },
      { $set: { name: name, nickname: nickname, bornDate: bornDate } }
    );

    if (resultado.modifiedCount == 1 && resultado.matchedCount == 1) {
      res.render("editarPerfil", {
        user: user,
        name: name,
        nickname: nickname,
        bornDate: bornDate,
        message: "Dados alterados com sucesso!",
        messageColor: "darkgreen",
      });
    } else {
      res.render("editarPerfil", {
        user: user,
        name: name,
        nickname: nickname,
        bornDate: bornDate,
        message: "Os dados não foram alterados",
        messageColor: "darkred",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar dados do usuário");
  } finally {
    client.close();
  }
});

module.exports = router;
