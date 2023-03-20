const mongoClient = require("../database/database");

async function getParticipantsRole(roleId) {
  let client = await mongoClient.connect();
  try {
    const rolesCollection = client.db("voidDatabase").collection("roles");

    const numeroParticipantes = await rolesCollection.findOne({_id: roleId });

    return numeroParticipantes.participantsRole.length;
  } catch (err) {
    console.error(err);
    return "Participantes não encontrados";
  } finally {
    //   client.close();
  }
}

module.exports = getParticipantsRole;