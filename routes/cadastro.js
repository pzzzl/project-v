const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoClient = require("../database/database");

router.get("/", (req, res) => {
  res.render("cadastro", { user: null, className: "hiddenClass" });
});

// Rota de cadastro de usuário
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
      _id: user,
      password: hashedPassword,
      name: name,
      nickname: nickname,
      bornDate: bornDate,
    });

    res.status(201).render("usuarioCadastradoComSucesso", { user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor");
  }
});

module.exports = router;
