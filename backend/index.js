const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
