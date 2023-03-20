const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");

router.get("/", verificaToken, (req, res) => {
  let user = req.user;
  res.render("perfil", { user: user });
});

module.exports = router;
