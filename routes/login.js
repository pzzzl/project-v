const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoClient = require("../database/database");

router.get("/", (req, res) => {
  res.render("index", { user: undefined, className: "hiddenClass" });
});

router.post("/", async (req, res) => {
  const { user, password } = req.body;
  let client;
  try {
    client = await mongoClient.connect();
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
    // res.sendStatus(500);
    res.status(500).send(err);
  } finally {
    if (client) await client.close();
  }
});

module.exports = router;
