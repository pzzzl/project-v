/** Roteador Express para deslogar um usuário.
 * @module routes/logout
 */
const express = require("express");
const router = express.Router();

/** Rota para deslogar um usuário.
 * @name GET /
 * @function
 * @memberof module:routes/logout
 * @param {Object} req - Objeto de solicitação HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
router.get("/", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
