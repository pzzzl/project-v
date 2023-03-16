const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded());

const saltRounds = 10;
const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`\n\n\n\n\n\nProject V listening on port ${port}\n`);
});

app.get("/home", (req, res) => {
  res.render("index", {user: "", erro: 'hiddenClass'});
});

app.get("/register", (req, res) => {
  res.render("register", {user: undefined});
});

function login(req, res, next) {
  let user = req.query["user"];
  let password = req.query["password"];
  console.log(
    `\nDados recebidos da requisição\nuser: ${user}\npassword: ${password}`
  );
  let passwordEncounteredOnDatabase;

  console.log("Conectando ao banco de dados...");

  mongoClient
    .connect((err) => {
      if (err) return console.error(err);
    })
    .then((result) => {
      console.log("Banco de dados conectado");
      let client = result;
      let usersCollection = client.db("voidDatabase").collection("users");

      console.log("Procurando usuário no banco de dados...");

      usersCollection
        .findOne({ _id: user })
        .then((findResult) => {
          if (findResult) {
            console.log("Usuário encontrado");
            // USUÁRIO EXISTE
            passwordEncounteredOnDatabase = findResult.password;

            if (passwordEncounteredOnDatabase) {
              console.log("Verificando se a senha está correta");
              bcrypt.compare(
                password,
                passwordEncounteredOnDatabase,
                function (err, result) {
                  if (err) return console.error(err);
                  if (result) {
                    // SENHA CORRETA
                    console.log("Senha correta\nEnviando para o perfil...");
                    next();
                  } else {
                    // SENHA INCORRETA
                    console.log("Senha incorreta");
                    res.render("index", { erro: '' , user: user});
                  }
                }
              );
            }
          } else {
            // USUÁRIO NÃO EXISTE
            res.render("register", { user: user });
          }
        })
        .catch((findError) => console.error(findError));
    });
}

app.get("/login", login, (req, res) => {
  res.redirect(`profile/${req.query["user"]}`);
});

app.get("/profile/:user", (req, res) => {
  res.render("profile", { user: req.params.user });
});

// bcrypt.genSalt(saltRounds, function (err, salt) {
//   if (err) return console.error(err);
//   bcrypt.hash(password, salt, function (err, hash) {
//     if (err) return console.error(err);
//     usersCollection.insertOne({ _id: user, password: hash });
//   });
// });
// client.close();
