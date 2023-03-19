/** Express Router para rotas de cadastro de usuários.
@module routes/cadastro
*/
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoClient = require("../database/database");

/** Renderiza a página de cadastro com um objeto user nulo e a classe "hiddenClass".
@function
@name get/cadastro
@memberof module:routes/cadastro
@param {object} req - Objeto de solicitação express.
@param {object} res - Objeto de resposta express.
@returns {void}
*/
router.get("/", (req, res) => {
  res.render("cadastro", { user: null, className: "hiddenClass" });
});

/** Cadastra um novo usuário no banco de dados.
@function
@name post/cadastro
@memberof module:routes/cadastro
@async
@param {object} req - Objeto de solicitação express.
@param {object} req.body - Objeto com informações do novo usuário.
@param {string} req.body.user - Identificação do novo usuário.
@param {string} req.body.password - Senha do novo usuário.
@param {string} req.body.name - Nome do novo usuário.
@param {string} req.body.nickname - Apelido do novo usuário.
@param {Date} req.body.bornDate - Data de nascimento do novo usuário.
@param {object} res - Objeto de resposta express.
@returns {void}
*/
router.post("/", async (req, res) => {
  const { user, password, name, nickname, bornDate } = req.body;
  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");
    const existingUser = await usersCollection.findOne({ _id: user });

    if (existingUser) {
      return res.render("cadastro", { user: user, className: "" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      _id: user.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      nickname: nickname.trim(),
      bornDate: bornDate,
    });

    res.status(201).render("usuarioCadastradoComSucesso", { user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor");
  }
});

module.exports = router;
