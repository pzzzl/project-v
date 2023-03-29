const { createReadStream } = require('fs');
const { join } = require('path');

module.exports = async (req, res) => {
  const { file } = req.query;
  if (!file) {
    return res.status(400).send('Nenhum arquivo fornecido');
  }

  const filePath = join(process.cwd(), 'uploads', file);
  const stream = createReadStream(filePath);
  stream.pipe(res);
}
