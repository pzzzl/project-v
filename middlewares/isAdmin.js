const mongoClient = require("../database/database");

async function isAdmin(req, res, next) {
  let client;

  try {
    client = await mongoClient.connect();
    let usersCollection = client.db("voidDatabase").collection("users");

    let result = await usersCollection.findOne({ _id: req.user });
    if (result.admin) {
      next();
    } else {
      res
        .status(403)
        .send("Você não possui permissão para acessar esta página");
    }
  } catch {
    res.send("Não foi possível verificar se o usuário é administrador");
  } finally {
    client.close();
  }
}

module.exports = isAdmin;
