// Importação do módulo express e criação de uma instância do aplicativo
const express = require("express");
const app = express();

// Middleware para tratamento de requisições JSON e URLEncoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do mecanismo de visualização do EJS
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));

// Middleware para tratamento de cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Carrega as variáveis de ambiente definidas no arquivo .env
require("dotenv").config();
const port = process.env.PORT || 3000;

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Server running on port ${port}\n`);
});

// Define uma rota para servir o arquivo global.css
app.get("/global.css", (req, res) => {
  res.sendFile(__dirname + "/public/global.css");
});

// Importação dos roteadores para cada rota
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
const painelDoAdministradorRouter = require("./routes/painelDoAdministrador");
const modificarUsuariosRouter = require("./routes/modificarUsuarios");
const editarFotoDePerfilRouter = require("./routes/editarFotoDePerfil");

// Define os roteadores para cada rota
app.use("/", rootRouter);
app.use("/login", loginRouter);
app.use("/cadastro", cadastroRouter);
app.use("/perfil", perfilRouter);
app.use("/perfil/editar", editarPerfilRouter);
app.use("/roles", rolesRouter);
app.use("/roles/criar", criarRoleRouter);
app.use("/usuarios", usuariosRouter);
app.use("/logout", logoutRouter);
app.use("/role", roleRouter);
app.use("/painel-do-administrador", painelDoAdministradorRouter);
app.use("/modificar/usuarios", modificarUsuariosRouter);
app.use("/perfil/editar/foto", editarFotoDePerfilRouter);
