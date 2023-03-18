/** Roteador Express para autenticação de usuário.
 * @module routes/login
 */
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoClient = require("../database/database");

/** Rota para renderizar a página inicial.
 * @name GET /
 * @function
 * @memberof module:routes/login
 * @param {Object} req - Objeto de solicitação HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
router.get("/", (req, res) => {
  res.render("index", { user: undefined, className: "hiddenClass" });
});

/** Rota para autenticação de usuário.
 * @name POST /
 * @function
 * @memberof module:routes/login
 * @async
 * @param {Object} req - Objeto de solicitação HTTP.
 * @param {Object} req.body - Corpo da solicitação HTTP contendo informações de usuário e senha.
 * @param {string} req.body.user - Nome de usuário.
 * @param {string} req.body.password - Senha do usuário.
 * @param {Object} res - Objeto de resposta HTTP.
 */
router.post("/", async (req, res) => {
  const { user, password } = req.body;

  try {
    const client = await mongoClient.connect();
    const usersCollection = client.db("voidDatabase").collection("users");

    const result = await usersCollection.findOne({ _id: user });

    if (!result) {
      // USUÁRIO NÃO EXISTE
      return res.render("cadastro", { user, className: "hiddenClass" });
    }

    // USUÁRIO ENCONTRADO
    const databaseHashedPassword = result.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      databaseHashedPassword
    );

    if (!isPasswordCorrect) {
      // SENHA INCORRETA
      return res.render("index", { user, className: "" });
    }

    // SENHA CORRETA
    const token = jwt.sign({ user }, process.env.PROJECT_V_TOKEN_SECRET, {
      expiresIn: `${process.env.PROJECT_V_JWT_DURATION}s`,
    });

    res.cookie("token", token, { httpOnly: true }).redirect("/perfil");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  } finally {
    mongoClient.close();
  }
});

module.exports = router;
