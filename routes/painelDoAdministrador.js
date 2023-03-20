const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", verificaToken, isAdmin, (req, res) => {
  res.render("painelDoAdministrador", { data: { user: req.user } });
});

module.exports = router;
