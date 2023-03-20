/** Formata a data em uma string no formato "DD/MM/AAAA".
 * @async
 * @function
 * @memberof module:routes/roles
 * @param {Date} date - A data a ser formatada.
 * @returns {Promise<string>} A data formatada em uma string.
 */
async function formatDate(date) {
  if (date) {
    var datePart = date.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return day + "/" + month + "/" + year;
  } else {
    return "";
  }
}

module.exports = formatDate;
