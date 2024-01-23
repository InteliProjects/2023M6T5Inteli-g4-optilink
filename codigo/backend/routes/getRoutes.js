/**
 * Rotas de método GET necessárias para o projeto
 * @module routes/getRoutes
 */
const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const router = express.Router();
const db = require('../models/conexao-db.js');

router.use(express.json());

/**
 * Retorna uma mensagem indicando que o servidor está rodando.
 * @name Raiz
 * @path {GET} /
 * @response {String} message Mensagem indicando que o servidor está rodando.
 */
router.get('/', (req, res) => {
    res.send("Server rodando");
});


/**
 * Rota GET para selecionar dados da tabela de alocação com base no estado e na data de início de execução.
 * Filtra a tabela 'alocacao' pelos critérios especificados na query.
 * 
 * @param {string} uf - Estado fornecido como parâmetro na query.
 * @param {string} dt_inicio_execucao - Data de início de execução fornecida como parâmetro na query.
 * @return {json} Resposta em formato JSON com os dados das alocações filtrados por estado e data.
 */
router.get('/tabelaAlocacao', (req, res) => {
  let uf = req.query.uf;
  let dt_inicio_execucao = req.query.dt_inicio_execucao;

  sql = 'SELECT DISTINCT * FROM alocacao WHERE uf = ? AND dt_inicio_execucao = ?';

  db.all(sql, [uf, dt_inicio_execucao], (err, rows) => {
    if (err) {
      res.status(400).json({'error': err.message});
      return;
    }
    res.json(rows);
  })

});

/** Rota para obter o estado, municipio e data da tabela instalacoes
* @route GET /setoresMunicipio
*/ 
router.get('/cidadeEstado', (req, res) => {

    let sql = "SELECT DISTINCT uf, municipio, data_inserido FROM instalacoes";

    db.all(sql, [], (err, rows) => {
        if (err) {
            /**
             * Erro ao buscar instalações.
             * @type {string}
             */
            res.status(500).send('Erro ao buscar instalações: ' + err.message);
            return;
        }

        /**
         * Resposta JSON contendo setores únicos.
         * @type {Array}
         */
        res.json(rows);
    });
});

/**
 * Rota GET para obter uma lista de estados únicos (uf).
 * Retorna uma lista de estados a partir da tabela 'instalacoes'.
 * 
 * @return {json} Resposta em formato JSON contendo os estados.
 */
router.get('/uf',(req,res)=>{
    let sql = `SELECT DISTINCT uf FROM instalacoes`;
    db.all(sql,[],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter uma lista de municípios únicos.
 * Retorna uma lista de municípios a partir da tabela 'instalacoes'.
 * 
 * @return {json} Resposta em formato JSON contendo os municípios.
 */
router.get('/municipios',(req,res)=>{
    let sql = `SELECT DISTINCT municipio FROM instalacoes`;
    db.all(sql,[],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter uma lista de municípios do historico alocacoes
 * Retorna uma lista de municípios a partir da tabela 'historico_instalacoes'.
 * 
 * @return {json} Resposta em formato JSON contendo os municípios.
 */
router.get('/municipiosDoHistorico',(req,res)=>{
    let sql = `SELECT DISTINCT municipio FROM historico_instalacoes`;
    db.all(sql,[],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter datas do historico de quando o algoritmo foi rodado no historico alocacoes.
 * 
 * @return {json} Resposta em formato JSON contendo as datas de início de execução.
 */
router.get('/datasDoHistorico',(req,res)=>{
    let sql = `SELECT DISTINCT Data FROM historico_tecnicos`;
    db.all(sql,[],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter todos os dados de uma data especifica do historico de alocações.
 * 
 * @return {json} Resposta em formato JSON contendo as datas de início de execução.
 */
router.get('/historicoAlocacao',(req,res)=>{
    let data = req.query.data_gerado;
    let sql = `SELECT DISTINCT * FROM historico_alocacao WHERE data_gerado = ?`;
    db.all(sql,[data],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter todos os dados de uma data especifica do historico de instalações.
 * 
 * @return {json} Resposta em formato JSON contendo as datas de início de execução.
 */
router.get('/historicoInstalacao',(req,res)=>{
    let data = req.query.data_gerado;
    let municipio = req.query.municipio;

    let sql = `SELECT DISTINCT * FROM historico_instalacoes WHERE Data = ? AND municipio = ?`;
    db.all(sql,[data, municipio],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter todos os dados de uma data especifica do historico de instalações.
 * 
 * @return {json} Resposta em formato JSON contendo as datas de início de execução.
 */
router.get('/historicoTecnicos',(req,res)=>{
    let data = req.query.data_gerado;
    let municipio = req.query.municipio;

    let sql = `SELECT DISTINCT * FROM historico_tecnicos WHERE Data = ? AND Cidade = ?`;
    db.all(sql,[data, municipio],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter datas de início de execução baseadas no município especificado.
 * A data é formatada para excluir a hora.
 * 
 * @param {string} cidade - Nome do município especificado na query.
 * @return {json} Resposta em formato JSON contendo as datas de início de execução.
 */
router.get('/datas',(req,res)=>{
    let cidade = req.query.municipio;
    let sql = `SELECT DISTINCT substr(dt_inicio_execucao, 1, 10) as dt_inicio_execucao FROM instalacoes WHERE municipio = ?`;
    db.all(sql,[cidade],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})

/**
 * Rota GET para obter todos os registros da tabela 'clusters'.
 * Esta rota consulta a tabela 'clusters' no banco de dados e retorna todos os registros.
 * 
 * @return {json} Resposta em formato JSON contendo todos os registros de 'clusters'.
 */
router.get('/clusters',(req,res)=>{
    let sql = `SELECT * FROM clusters`;
    db.all(sql,[],(err,rows)=>{
        if (err){
            // Em caso de erro na consulta, envia a mensagem de erro como resposta.
            res.send(err.message);
            return;
        }
        // Retorna os dados obtidos em formato JSON.
        res.json(rows);
    })
})

/**
 * Rota GET para selecionar todos os dados dos técnicos cadastrados.
 * Consulta a tabela 'partida_tecnicos' e retorna todos os registros.
 * 
 * @return {json} Resposta em formato JSON com todos os dados dos técnicos.
 */
router.get('/tecnicos',(req,res)=>{
    let sql = `SELECT DISTINCT * FROM partida_tecnicos`;
    db.all(sql,[],(err,rows)=>{
        if (err){
            res.send(err.message)
            return
        }
        res.json(rows)
    })
})



/**
 * Lê arquivos CSV de clusters e alocação e insere os dados no banco de dados.
 * A rota responde com uma mensagem de sucesso se todos os dados forem inseridos corretamente.
 * Em caso de erro durante a leitura do arquivo CSV ou a inserção no banco de dados, a rota responde com uma mensagem de erro.
 * @name SalvarDados
 * @path {GET} /salvarDados
 * @response {String} message Mensagem indicando que os dados foram inseridos com sucesso.
 * @response {String} error Mensagem de erro se a inserção falhar.
 */
router.get('/salvarDados', (req, res) => {
    let dataAtual = new Date().toISOString().slice(0, 10);
    db.serialize(() => {
        db.run('DELETE FROM clusters', (err) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao apagar dados de clusters: ' + err.message });
            }
        });

        db.run('DELETE FROM alocacao', (err) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao apagar dados de clusters: ' + err.message });
            }
        });

        const inserirClusters = () => {
            const stream = fs.createReadStream('arquivos/clusters.csv')
                .pipe(csvParser());

            stream.on('data', (row) => {
                db.run('INSERT INTO clusters (latitude, longitude, cluster) VALUES (?, ?, ?)',
                [row.latitude, row.longitude, row.cluster], (err) => {
                    if (err) {
                        // Encerra o stream e retorna o erro
                        stream.destroy();
                        res.status(500).json({ error: 'Erro ao inserir dados de clusters: ' + err.message });
                    }
                });
            });

            stream.on('end', () => {
                // Se todos os dados foram inseridos sem erros, prossegue para a próxima inserção
                inserirAlocacao();
            });

            stream.on('error', (err) => {
                // Retorna o erro que ocorreu durante a leitura do arquivo
                res.status(500).json({ error: 'Erro ao ler o arquivo de clusters: ' + err.message });
            });
        };

        const inserirAlocacao = () => {
            const stream = fs.createReadStream('arquivos/alocacao.csv')
                .pipe(csvParser());

            stream.on('data', (row) => {
                db.run('INSERT INTO alocacao (uf, matricula_wfm, nome, latitude_tecnico, longitude_tecnico, dt_inicio_execucao, setor, instalado, cluster, latitude_demanda, longitude_demanda, ordem, distancia_tecnico_cluster , distancia_total_tecnico_cluster) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [row.uf, row.matricula, row.nome, row.latitude_tecnico, row.longitude_tecnico, row.dt_inicio_execucao, row.setor, row.instalado, row.cluster, row.latitude_demanda, row.longitude_demanda, row.ordem, row.distancia_tecnico_cluster, row.distancia_total_tecnico_cluster], (err) => {
                    if (err) {
                        // Encerra o stream e retorna o erro
                        stream.destroy();
                        res.status(500).json({ error: 'Erro ao inserir dados de alocação: ' + err.message });
                    }
                });
            });

            stream.on('end', () => {
                // Se todos os dados foram inseridos sem erros, envia mensagem de sucesso
                res.json({ success: 'Todos os dados de clusters e alocação foram inseridos com sucesso.' });
            });

            stream.on('error', (err) => {
                // Retorna o erro que ocorreu durante a leitura do arquivo
                res.status(500).json({ error: 'Erro ao ler o arquivo de alocação: ' + err.message });
            });
        };

        // Inicia o processo de inserção com os clusters
        inserirClusters();
    });
});


router.get('/salvarSobras', (req, res) => { 
    let dataAtual = new Date().toISOString().slice(0, 10);
    const fileRows = [];
    db.run('DELETE FROM sobras_tecnicos WHERE data_gerado = ?', dataAtual, (err) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao apagar dados de clusters: ' + err.message });
        }
    });

    db.run('DELETE FROM chamadas_sobrando WHERE data_gerado = ?', dataAtual, (err) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao apagar dados de clusters: ' + err.message });
        }
    });

    fs.createReadStream('arquivos/tecnicos_sobrando.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            fileRows.push(row);
        })
        .on('end', () => {
            db.serialize(() => {
                let sql = db.prepare('INSERT INTO sobras_tecnicos (uf, matricula_wfm, nome, ativo, latitude, longitude, territorio_de_servico_nome, cidade, assigned_cluster, total_distance, data_gerado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

                for (const row of fileRows) {
                    sql.run(row.uf, row.matricula, row.nome, row.ativo, row.latitude, row.longitude, row.territorio_servico_nome, row.cidade, row.assigned_cluster, row.total_distance, dataAtual);
                }

                sql.finalize();
            });

        });

        const chamadasFileRows = [];
        fs.createReadStream('arquivos/chamadas_sobrando.csv')
            .pipe(csvParser())
            .on('data', (row) => {
                chamadasFileRows.push(row);
            })
            .on('end', () => {
                db.serialize(() => {
                    let sql = db.prepare('INSERT INTO chamadas_sobrando (id_venda, dt_inicio_execucao, setor, instalado, latitude, longitude, cluster, data_gerado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

                    for (const row of chamadasFileRows) {
                        sql.run(row.id_venda, row.dt_inicio_execucao, row.setor, row.instalado, row.latitude, row.longitude, row.cluster, dataAtual);
                    }

                    sql.finalize();
                });

                res.send('Arquivos CSV processados.');
            });
});

router.get('/salvarDadosHistoricos', (req, res) => {
    let dataAtual = new Date().toISOString().slice(0, 10);
    db.serialize(() => {
        db.run('DELETE FROM historico_clusters WHERE data_gerado = ?', dataAtual, (err) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao apagar dados de clusters: ' + err.message });
            }
        });

        db.run('DELETE FROM historico_alocacao WHERE data_gerado = ?', dataAtual, (err) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao apagar dados de clusters: ' + err.message });
            }
        });

        const inserirClusters = () => {
            const stream = fs.createReadStream('arquivos/clusters.csv')
                .pipe(csvParser());

            stream.on('data', (row) => {
                db.run('INSERT INTO historico_clusters (latitude, longitude, cluster, data_gerado) VALUES (?, ?, ?, ?)',
                [row.latitude, row.longitude, row.cluster, dataAtual], (err) => {
                    if (err) {
                        // Encerra o stream e retorna o erro
                        stream.destroy();
                        res.status(500).json({ error: 'Erro ao inserir dados de clusters: ' + err.message });
                    }
                });
            });

            stream.on('end', () => {
                // Se todos os dados foram inseridos sem erros, prossegue para a próxima inserção
                inserirAlocacaoHistorico();
            });

            stream.on('error', (err) => {
                // Retorna o erro que ocorreu durante a leitura do arquivo
                res.status(500).json({ error: 'Erro ao ler o arquivo de clusters: ' + err.message });
            });
        };

        const inserirAlocacaoHistorico = () => {
            const stream = fs.createReadStream('arquivos/alocacao.csv')
                .pipe(csvParser());

            stream.on('data', (row) => {
                db.run('INSERT INTO historico_alocacao (uf, matricula_wfm, nome, latitude_tecnico, longitude_tecnico, dt_inicio_execucao, setor, instalado, cluster, latitude_demanda, longitude_demanda, ordem, distancia_tecnico_cluster , distancia_total_tecnico_cluster, data_gerado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [row.uf, row.matricula, row.nome, row.latitude_tecnico, row.longitude_tecnico, row.dt_inicio_execucao, row.setor, row.instalado, row.cluster, row.latitude_demanda, row.longitude_demanda, row.ordem, row.distancia_tecnico_cluster, row.distancia_total_tecnico_cluster, dataAtual], (err) => {
                    if (err) {
                        // Encerra o stream e retorna o erro
                        stream.destroy();
                        res.status(500).json({ error: 'Erro ao inserir dados de alocação: ' + err.message });
                    }
                });
            });

            stream.on('end', () => {
                // Se todos os dados foram inseridos sem erros, envia mensagem de sucesso
                res.json({ success: 'Todos os dados de clusters e alocação foram inseridos com sucesso.' });
            });

            stream.on('error', (err) => {
                // Retorna o erro que ocorreu durante a leitura do arquivo
                res.status(500).json({ error: 'Erro ao ler o arquivo de alocação: ' + err.message });
            });
        };

        // Inicia o processo de inserção com os clusters
        inserirClusters();
        //inserirAlocacao();
    });
});



module.exports = router;