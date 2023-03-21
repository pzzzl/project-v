async function getParticipantsRole(roleId, rolesCollection) {
  try {
    const numeroParticipantes = await rolesCollection.findOne({ _id: roleId });

    return numeroParticipantes.participantsRole.length;
  } catch (err) {
    console.error(err);
    return "Participantes não encontrados";
  }
}

module.exports = getParticipantsRole;
