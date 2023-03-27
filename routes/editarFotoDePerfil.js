const express = require("express");
const verificaToken = require("../middlewares/verificaToken");
const router = express.Router();
const jimp = require("jimp");
const fs = require("fs");
const multer = require("multer");

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.PROJECT_V_DB_USER}:${process.env.PROJECT_V_DB_PASSWORD}@void-cluster.1zdu3qi.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Define o destino dos arquivos enviados pelo multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Define o filtro de arquivos permitidos
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    return cb(
      new Error(
        "Apenas imagens são permitidas<script>function redirect(){document.location='/perfil/editar/foto'};setTimeout(redirect, 2000);</script>"
      )
    );
  }
};

// Configura o multer para lidar com o upload de arquivos
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.get("/", verificaToken, (req, res) => {
  res.render("editarFotoDePerfil");
});

router.post(
  "/",
  verificaToken,
  upload.single("file"),
  async (req, res) => {
    const client = await mongoClient.connect();
    let usersCollection = client.db("voidDatabase").collection("users");

    try {
      let user = req.user;

      // Abre a imagem usando o Jimp
      const image = await jimp.read(req.file.path);
      // Redimensiona a imagem para 200x200
      image.resize(200, 200);
      // Corta a imagem para 150x150 a partir do canto superior esquerdo
      image.crop(0, 0, 200, 200);
      // Converte a imagem para base64
      const base64 = await image.getBase64Async(jimp.MIME_JPEG);

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      let resultado = await usersCollection.updateOne({ _id: user }, { $set: { picture: base64 } }).then(result => {
        if(result) {
            res.redirect('/perfil')
        }
      }, err => {
        console.log('erro')
      })

      
    } catch {
      res.send("Não foi possível alterar a foto de perfil");
    } finally {
      if (client) await client.close();
    }
  },
  function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // Erro do Multer
      res.status(400).send("Erro ao fazer upload do arquivo");
    } else {
      // Outro erro
      res.status(400).send(err.message);
    }
  }
);

module.exports = router;
