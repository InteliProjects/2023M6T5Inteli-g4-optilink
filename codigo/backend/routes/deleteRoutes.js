/**
 * @fileoverview Rota de endpoints para operações de exclusão no banco de dados.
 * @module routes/deleteRoutes
 * @requires express
 * @requires ../models/conexao-db
 */

const express = require('express');
const router = express.Router();
const db = require('../models/conexao-db.js');

/**
 * Exclui uma instalação pelo ID.
 * @name ExcluirInstalacao
 * @path {DELETE} /servicos/:id_venda
 * @params {String} id_venda - O ID da venda associada à instalação a ser excluída.
 * @response {Object} - Mensagem de confirmação de sucesso e o número de mudanças realizadas no banco de dados.
 * @response {Object} - Mensagem de erro e o status 500 em caso de falha na operação.
 */
router.delete('/servicos/:id_venda', (req, res) => {
  const id_venda = req.params.id_venda;
  db.run('DELETE FROM instalacoes WHERE id_venda = ?', id_venda, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Serviço excluído com sucesso', changes: this.changes });
  });
});

/**
 * Exclui um técnico pela matrícula.
 * @name ExcluirTecnico
 * @path {DELETE} /partida_tecnicos/:matricula
 * @params {String} matricula - A matrícula do técnico a ser excluído.
 * @response {Object} - Mensagem de confirmação de sucesso e o número de mudanças realizadas no banco de dados.
 * @response {Object} - Mensagem de erro e o status 500 em caso de falha na operação.
 */
router.delete('/partida_tecnicos/:matricula', (req, res) => {
  const matricula = req.params.matricula;
  db.run('DELETE FROM partida_tecnicos WHERE Matricula = ?', matricula, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Técnico excluído com sucesso', changes: this.changes });
  });
});

router.delete('/tecnicos', (req, res) => {
  db.run('DELETE FROM partida_tecnicos', function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Todos os técnicos foram excluídos com sucesso', changes: this.changes });
  });
});

module.exports = router;
