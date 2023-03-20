const mongoClient = require("../database/database");

async function getUserNickname(userId) {
  let client = await mongoClient.connect();
  try {
    const usersCollection = client.db("voidDatabase").collection("users");

    const userFound = await usersCollection.findOne({ _id: userId });
    return userFound.nickname;
  } catch (err) {
    console.error(err);
    return "Usuário não encontrado";
  } finally {
    //   client.close();
  }
}

module.exports = getUserNickname;
