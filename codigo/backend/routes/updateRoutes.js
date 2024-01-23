/**
 * @fileoverview Rota para atualizar registros de instalações e técnicos no banco de dados.
 * @module routes/updateRoutes
 * @requires express
 * @requires ../models/conexao-db
 */

const express = require('express');
const router = express.Router();
const db = require('../models/conexao-db.js'); 

/**
 * Atualiza os dados de uma instalação específica identificada pelo ID da venda.
 * @name AtualizarInstalacao
 * @path {PUT} /servicos/id_venda
 * @params {String} id_venda - O ID da venda da instalação que será atualizada.
 * @body {Object} newData - Os novos dados para atualizar a instalação, incluindo BA, UF, município, matrícula do técnico, e outros detalhes relevantes.
 * @response {Object} message - Mensagem de confirmação de sucesso e o número de registros atualizados.
 * @response {Object} error - Mensagem de erro e o status 500 em caso de falha na operação de atualização.
 */
router.put('/servicos/:id_venda', (req, res) => {
  const id_venda = req.params.id_venda;
  const newData = req.body; 

  db.run('UPDATE instalacoes SET ba=?, uf=?, municipio=?, matricula_tecnico=?, setor=?, dt_abertura_ba=?, dt_inicio_execucao=?, dt_fim_execucao=?, instalado=?, logradouro=?, numero=?, bairro=?, cep=?, latitude=?, longitude=? WHERE id_venda=?',
    [newData.ba, newData.uf, newData.municipio, newData.matricula_tecnico, newData.setor, newData.dt_abertura_ba, newData.dt_inicio_execucao, newData.dt_fim_execucao, newData.instalado, newData.logradouro, newData.numero, newData.bairro, newData.cep, newData.latitude, newData.longitude, id_venda],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Serviço atualizado com sucesso', changes: this.changes });
  });
});

/**
 * Atualiza os dados de um técnico específico identificado pela matrícula.
 * @name AtualizarTecnico
 * @path {PUT} /partida_tecnicos/:matricula
 * @params {String} matricula - A matrícula do técnico que será atualizado.
 * @body {Object} newData - Os novos dados para atualizar o técnico, incluindo UF, nome, status ativo, latitude, longitude, e outros detalhes relevantes.
 * @response {Object} message - Mensagem de confirmação de sucesso e o número de registros atualizados.
 * @response {Object} error - Mensagem de erro e o status 500 em caso de falha na operação de atualização.
 */
router.put('/partida_tecnicos/:matricula', (req, res) => {
  const matricula = req.params.matricula;
  const newData = req.body; 
  

  db.run('UPDATE partida_tecnicos SET UF=?, Nome=?, Ativo=?, Latitude=?, Longitude=?, Territorio_Servico_Nome=?, Cidade=? WHERE Matricula=?',
    [newData.UF, newData.Nome, newData.Ativo, newData.Latitude, newData.Longitude, newData.Territorio_Servico_Nome, newData.Cidade, matricula],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Técnico atualizado com sucesso', changes: this.changes });
  });
});

module.exports = router;
