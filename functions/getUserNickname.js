async function getUserNickname(userId, usersCollection) {
  try {
    const userFound = await usersCollection.findOne({ _id: userId });
    return userFound.nickname;
  } catch (err) {
    console.error(err);
    return "Usuário não encontrado";
  }
}

module.exports = getUserNickname;
