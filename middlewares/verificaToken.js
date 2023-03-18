const jwt = require("jsonwebtoken");

function verificaToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.send("<script>window.location = '/login'</script>");
  }

  jwt.verify(token, process.env.PROJECT_V_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.render("expiredSession");
    }

    req.user = decoded.user;
    next();
  });
}

module.exports = verificaToken;
