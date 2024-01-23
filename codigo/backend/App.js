const express = require('express');
const bodyParser = require('body-parser');
const deleteRoutes = require('./routes/deleteRoutes');
const updateRoutes = require('./routes/updateRoutes');
const algoritmoRoute = require('./routes/algoritmoRoute.js');
const uploadCSV = require('./routes/uploadCSV.js');
const getRoutes = require('./routes/getRoutes.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(bodyParser.json());

// Rota para rodar o algoritmo
app.use('/api/algoritmo', algoritmoRoute);

// Rotas para exclusão
app.use('/api', deleteRoutes);

// Rotas para atualização
app.use('/api', updateRoutes);

// Rota para fazer get das cidades
app.use('/api', getRoutes);

// Rota para dar upload dos arquivos CSV
app.use('/api', uploadCSV)

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
