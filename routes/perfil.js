/** Roteador Express para exibir o perfil de um usuário.
 * @module routes/perfil
 */
const express = require("express");
const router = express.Router();
const verificaToken = require("../middlewares/verificaToken");

/** Rota para exibir o perfil de um usuário.
 * @name GET /
 * @function
 * @memberof module:routes/perfil
 * @param {Object} req - Objeto de solicitação HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 * @param {function} next - Função callback para chamar o próximo middleware.
 * @throws {Error} Se não houver token no cookie ou o token não for válido.
 */
router.get("/", verificaToken, (req, res) => {
  let user = req.user;
  res.render("perfil", { user: user });
});

module.exports = router;
