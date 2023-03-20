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
