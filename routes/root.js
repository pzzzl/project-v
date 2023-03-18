/**
 * @route GET /
 * @description Rota para redirecionar o usuário para a página de perfil
 * @access Público
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {void}
 */
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/perfil");
});

module.exports = router;
