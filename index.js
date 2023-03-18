// Importa o framework Express
const express = require("express");
const app = express();

// Define as opções de configuração do Express
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Configura o arquivo .env
require("dotenv").config();

// Define a porta em que o servidor irá rodar
const port = process.env.PORT || 3000;

// Inicia o servidor na porta escolhida
app.listen(port, () => {
  console.log(`Server running on port ${port}\n`);
});

// Importa os roteadores das diferentes rotas
const rootRouter = require("./routes/root");
const loginRouter = require("./routes/login");
const cadastroRouter = require("./routes/cadastro");
const perfilRouter = require("./routes/perfil");
const editarPerfilRouter = require("./routes/editarPerfil");
const rolesRouter = require("./routes/roles");
const criarRoleRouter = require("./routes/criarRole");
const usuariosRouter = require("./routes/usuarios");
const logoutRouter = require("./routes/logout");

// Define as rotas e seus respectivos roteadores
app.use("/", rootRouter);
app.use("/login", loginRouter);
app.use("/cadastro", cadastroRouter);
app.use("/perfil", perfilRouter);
app.use("/perfil/editar", editarPerfilRouter);
app.use("/roles", rolesRouter);
app.use("/roles/criar", criarRoleRouter);
app.use("/usuarios", usuariosRouter);
app.use("/logout", logoutRouter);
