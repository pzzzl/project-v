const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function isAdmin(req, res, next) {
  try {
    const client = await mongoClient.connect();
    let usersCollection = client.db("voidDatabase").collection("users");

    let result = await usersCollection.findOne({ _id: req.user });
    if (result.admin) {
      next();
    } else {
      res
        .status(403)
        .send(
          "Você não possui permissão para acessar esta página<script>function redirect() {window.location='/perfil'}setTimeout(redirect, 2000)</script>"
        );
    }
  } catch {
    res.send("Não foi possível verificar se o usuário é administrador");
  } finally {
    mongoClient.close().catch((err) => console.error(err));
  }
}

module.exports = isAdmin;
