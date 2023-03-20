const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/verificaToken");
const isAdmin = require("../middlewares/isAdmin");
const mongoClient = require("../database/database");

router.get("/", verificarToken, isAdmin, (req, res) => {
  res.render("modificarUsuarios");
});

module.exports = router;
