
const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});


const port = 4200;

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});