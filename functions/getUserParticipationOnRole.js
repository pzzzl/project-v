const { ObjectId } = require("mongodb");

async function getUserParticipationOnRole(userId, roleId, rolesCollection) {
  try {
    let confirmed = false;
    await rolesCollection
      .findOne({
        _id: new ObjectId(roleId),
        participantsRole: { $in: [userId] },
      })
      .then((result) => {
        if (result) {
          confirmed = true;
        } else {
          confirmed = false;
        }
      });
    return confirmed;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = getUserParticipationOnRole;
