const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer();

app.post('/test', upload.none(), (req, res) => {
  // Accédez aux données du formulaire à l'aide de req.body
  console.log(req.body);
  // Traitez les données du formulaire ici
  // ...
});

app.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000');
});