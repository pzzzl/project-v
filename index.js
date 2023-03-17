const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const saltRounds = 10;
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`\n\n\n\n\n\nProject V listening on port ${port}\n`);
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/cadastro", (req, res) => {
  res.render("cadastro", { user: null, className: "hiddenClass" });
});

// Rota de cadastro de usuário
app.post("/cadastro", async (req, res) => {
  const { user, password } = req.body;

  mongoClient
    .connect((err) => {
      if (err) return console.error(err);
    })
    .then((result) => {
      let client = result;
      let usersCollection = client.db("voidDatabase").collection("users");

      let userExists;

      usersCollection
        .findOne({ _id: user })
        .then((result) => {
          if (result) {
            userExists = true;
            return res.render("cadastro", { user: user, className: "" });
          } else {
            bcrypt.hash(password, saltRounds, function (err, hash) {
              usersCollection
                .insertOne({ _id: user, password: hash })
                .then((result) => {
                  res
                    .status(201)
                    .render("usuarioCadastradoComSucesso", { user: user });
                })
                .catch((userCreationError) => console.error(userCreationError));
            });
          }
        })
        .catch((findUserError) => console.error(findUserError));
      // client.close();
    });
});

app.get("/login", (req, res) => {
  res.render("index", { user: undefined, className: "hiddenClass" });
});

// Rota de autenticação de usuário
app.post("/login", async (req, res) => {
  const { user, password } = req.body;

  mongoClient
    .connect((err) => {
      if (err) return console.error(err);
    })
    .then((result) => {
      let client = result;
      let usersCollection = client.db("voidDatabase").collection("users");

      usersCollection
        .findOne({ _id: user })
        .then((result) => {
          if (result) {
            // USUÁRIO ENCONTRADO
            let databaseHashedPassword = result.password;
            bcrypt.compare(
              password,
              databaseHashedPassword,
              function (err, result) {
                if (result) {
                  // SENHA CORRETA
                  const token = jwt.sign(
                    { user },
                    process.env.PROJECT_V_TOKEN_SECRET,
                    {
                      expiresIn: `${process.env.PROJECT_V_JWT_DURATION}s`,
                    }
                  );
                  res
                    .cookie("token", token, { httpOnly: true })
                    .send('<script>document.location = "/perfil"</script>');
                } else {
                  res.render("index", { user: user, className: "" });
                }
              }
            );
          } else {
            // USUÁRIO NÃO EXISTE
            res.render("cadastro", { user: user, className: "hiddenClass" });
          }
        })
        .catch((findUserError) => console.error(findUserError));
    });
});

function verificaToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.send("<script>window.location = '/login'</script>");
  }

  jwt.verify(token, process.env.PROJECT_V_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // SESSÃO EXPIRADA - REDIRECIONA PARA O LOGIN
      return res.render("expiredSession");
    }

    req.user = decoded.user;
    next();
  });
}

app.get("/perfil", verificaToken, (req, res) => {
  let user = req.user;
  res.render("profile", { user: user });
});

app.get("/logout", (req, res) => {
  res
    .cookie("token", "", { httpOnly: true })
    .send('<script>document.location = "/login"</script>');
});

app.get("/", (req, res) => {
  res.send("<script>window.location = '/perfil'</script>");
});
