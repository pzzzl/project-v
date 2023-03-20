/** Importa o framework Express
@const {object} express - Framework Express
*/
const express = require("express");

/** Instancia o framework Express
@type {object}
*/
const app = express();

/** Define o middleware para parsear JSON
@function
@name app.use
@param {object} express.json() - Middleware para parsear JSON
@returns {void}
*/
app.use(express.json());

/** Define o middleware para parsear os dados submetidos no corpo da requisição
@function
@name app.use
@param {object} express.urlencoded() - Middleware para parsear dados de formulário
@returns {void}
*/
app.use(express.urlencoded({ extended: true }));

/** Define o template engine EJS
@function
@name app.set
@param {string} "view engine" - Nome da propriedade a ser definida
@param {string} "ejs" - Nome do template engine
@returns {void}
*/
app.set("view engine", "ejs");

/** Importa o módulo path
@const {object} path - Módulo path
*/
const path = require("path");

/** Define o diretório de views do servidor
@function
@name app.set
@param {string} "views" - Nome da propriedade a ser definida
@param {string} path.join(__dirname, "views") - Caminho absoluto para o diretório de views
@returns {void}
*/
app.set("views", path.join(__dirname, "views"));

/** Importa o middleware cookie-parser
@const {function} cookieParser - Middleware cookie-parser
*/
const cookieParser = require("cookie-parser");

/** Define o middleware cookie-parser
@function
@name app.use
@param {function} cookieParser() - Middleware cookie-parser
@returns {void}
*/
app.use(cookieParser());

/** Configura o arquivo .env
@function
@name require
@param {string} "dotenv" - Nome do módulo .env
@returns {void}
*/
require("dotenv").config();

/** Define a porta em que o servidor irá rodar
@const {number} port - Porta do servidor
*/
const port = process.env.PORT || 3000;

/** Inicia o servidor na porta escolhida
@function
@name app.listen
@param {number} port - Porta em que o servidor irá rodar
@param {function} - Callback para executar quando o servidor for iniciado
@returns {void}
*/
app.listen(port, () => {
  console.log(`Server running on port ${port}\n`);
});

/** Importa os roteadores das diferentes rotas
@const {object} rootRouter - roteador da rota root
@const {object} loginRouter - roteador da rota login
@const {object} cadastroRouter - roteador da rota cadastro
@const {object} perfilRouter - roteador da rota perfil
@const {object} editarPerfilRouter - roteador da rota editar perfil
@const {object} rolesRouter - roteador da rota roles
@const {object} criarRoleRouter - roteador da rota criar role
@const {object} usuariosRouter - roteador da rota usuarios
@const {object} logoutRouter - roteador da rota logout
*/
const rootRouter = require("./routes/root");
const loginRouter = require("./routes/login");
const cadastroRouter = require("./routes/cadastro");
const perfilRouter = require("./routes/perfil");
const editarPerfilRouter = require("./routes/editarPerfil");
const rolesRouter = require("./routes/roles");
const criarRoleRouter = require("./routes/criarRole");
const usuariosRouter = require("./routes/usuarios");
const logoutRouter = require("./routes/logout");
const roleRouter = require("./routes/exibirRole");

/** Define as rotas e seus respectivos roteadores
@function use
@param {string} path - a URL raiz da rota
@param {object} middleware - o roteador correspondente à rota especificada
*/
app.use("/", rootRouter);
app.use("/login", loginRouter);
app.use("/cadastro", cadastroRouter);
app.use("/perfil", perfilRouter);
app.use("/perfil/editar", editarPerfilRouter);
app.use("/roles", rolesRouter);
app.use("/roles/criar", criarRoleRouter);
app.use("/usuarios", usuariosRouter);
app.use("/logout", logoutRouter);
app.use("/role", roleRouter)

app.get("/global.css", (req, res) => {
  res.sendFile(__dirname + "/public/global.css");
});
