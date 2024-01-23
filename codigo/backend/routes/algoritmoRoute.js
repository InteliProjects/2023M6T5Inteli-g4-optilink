const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const db = require('../models/conexao-db.js');

/**
 * Rota para enviar arquivos para um serviço Flask usando multipart/form-data.
 * @name sendToFlask
 * @path {POST} /send-to-flask
 * @code {200} Se os arquivos foram enviados e processados com sucesso pelo serviço Flask.
 * @code {500} Se ocorrer um erro durante o envio ou processamento dos arquivos.
 * @response {Blob|String} Retorna o arquivo de resposta do serviço Flask ou uma mensagem de erro.
 */
router.post('/send-to-flask', async (req, res) => {
  const { estado, cidade, data } = req.body;
  const dataAtual = new Date().toISOString().slice(0, 10);

  try {
    const rowsInstalacoes = await allAsync(db, 'SELECT DISTINCT ba, uf, municipio, matricula_tecnico, id_venda, setor, dt_abertura_ba, dt_inicio_execucao, dt_fim_execucao, instalado, logradouro, numero, bairro, cep, latitude, longitude FROM instalacoes WHERE uf = ? AND municipio = ? AND SUBSTRING(dt_inicio_execucao, 1, 10) = ?', [estado, cidade, data]);
    const rowsTecnicos = await allAsync(db, 'SELECT DISTINCT * FROM partida_tecnicos WHERE UF = ? AND Cidade = ?', [estado, cidade]);
    await runAsync(db, 'DELETE FROM historico_instalacoes WHERE municipio = ? AND Data = ?', [cidade, dataAtual]);
    await runAsync(db, 'DELETE FROM historico_tecnicos WHERE Cidade = ? AND Data = ?', [cidade, dataAtual]);


    const csvInstalacoes = converteParaCSV(rowsInstalacoes);
    const csvTecnicos = converteParaCSV(rowsTecnicos);
    const bufferInstalacoes = Buffer.from(csvInstalacoes);
    const bufferTecnicos = Buffer.from(csvTecnicos);

    console.log(data, cidade)
    const formData = new FormData();
    if (bufferInstalacoes && bufferTecnicos) {
      formData.append('demanda', bufferInstalacoes, { filename: 'demanda.csv' });
      formData.append('tecnicos', bufferTecnicos, { filename: 'tecnicos.csv' });
  } else {
      // Tratar caso os buffers sejam undefined
      console.error("Buffers de instalações ou técnicos são undefined");
      return res.status(500).send("Erro ao processar arquivos para envio");
  }
    formData.append('data', data.toString());
    //formData.append('produtividade', produtividade.toString());
    //formData.append('max_distancia', max_distancia.toString());
    formData.append('cidade', cidade.toString());

    const algoritmo_response = await axios.post('http://127.0.0.1:5000/upload', formData, {
      headers: {
        ...formData.getHeaders()
      },
      responseType: 'blob'
    });

    await axios.get('http://localhost:3000/api/salvarDados')
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Houve um erro na requisição', error);
          });

    await axios.get('http://localhost:3000/api/salvarDadosHistoricos')
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Houve um erro na requisição', error);
          });

    res.send(algoritmo_response.data);

    await axios.get('http://localhost:3000/api/salvarSobras')
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Houve um erro na requisição', error);
          });

    for (const row of rowsInstalacoes) {
            await runAsync(db, 'INSERT INTO historico_instalacoes (ba, uf, municipio, matricula_tecnico, id_venda, setor, dt_abertura_ba, dt_inicio_execucao, dt_fim_execucao, instalado, logradouro, numero, bairro, cep, latitude, longitude, Data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [...Object.values(row), dataAtual]);
    }
    console.log("dados historico demandas inseridos");
    for (const row of rowsTecnicos) {
            await runAsync(db, 'INSERT INTO historico_tecnicos (UF, Matricula, Nome, Ativo, Latitude, Longitude, Territorio_Servico_Nome, Cidade, Data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [...Object.values(row), dataAtual]);
    }
    console.log("dados historico tecnicos inseridos");

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro durante a operação');
  }
});


function runAsync(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function allAsync(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function converteParaCSV(dados) {
  if (dados.length === 0) {
    return '';
  }

  const cabecalho = Object.keys(dados[0]).join(',') + '\n';
  const linhas = dados.map(obj => 
    Object.values(obj).join(',')
  ).join('\n');

  return cabecalho + linhas;
}


module.exports = router;