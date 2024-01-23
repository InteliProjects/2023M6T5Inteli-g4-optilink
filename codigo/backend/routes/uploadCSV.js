const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const router = express.Router();
const db = require('../models/conexao-db.js');
const upload = multer({ dest: '../uploads/' });

/**
 * Processa o upload de um arquivo CSV e insere os dados de instalações no banco de dados.
 * @name UploadInstalacoes
 * @path {POST} /uploadInstalacoes
 * @code {200} Se o arquivo foi processado com sucesso e os dados inseridos.
 * @code {500} Se ocorrer um erro durante o processamento ou inserção dos dados.
 * @response {String} message Mensagem de sucesso após o processamento e inserção dos dados.
 */
router.post('/uploadInstalacoes', upload.single('file'), (req, res) => {
    console.log('Received file:', req.file);
    const fileRows = [];
    let municipioEspecifico = null;
    const dataAtual = new Date().toISOString().slice(0, 10);
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (row) => {
            if (!municipioEspecifico) {
                municipioEspecifico = row.municipio;
            }
            fileRows.push(row);
        })
        .on('end', () => {
            if (municipioEspecifico) {
                db.serialize(() => {
                    db.run('DELETE FROM instalacoes WHERE municipio = ?', municipioEspecifico, (err) => {
                        if (err) {
                            res.status(500).send('Erro ao excluir dados de ' + municipioEspecifico + ': ' + err.message);
                            return;
                        }

                        console.log("insert");
                        let sql = db.prepare('INSERT INTO instalacoes (ba, uf, municipio, matricula_tecnico, id_venda, setor, dt_abertura_ba, dt_inicio_execucao, dt_fim_execucao, instalado, logradouro, numero, bairro, cep, latitude, longitude, data_inserido) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                        for (const row of fileRows) {
                            sql.run(row.ba, row.uf, row.municipio, row.matricula_tecnico, row.id_venda, row.setor, row.dt_abertura_ba, row.dt_inicio_execucao, row.dt_fim_execucao, row.instalado, row.logradouro, row.numero, row.bairro, row.cep, row.latitude, row.longitude, dataAtual);
                        }
                        sql.finalize();
                    });
                });
            }
            console.log(fileRows)
            console.log("funcionou")
            fs.unlinkSync(req.file.path);
            res.send('Arquivo CSV processado para o município de ' + municipioEspecifico);
        });
});


/**
 * Processa o upload de um arquivo CSV e insere os dados de partida de técnicos no banco de dados.
 * @name UploadPartidaTecnicos
 * @path {POST} /uploadPartidaTecnicos
 * @code {200} Se o arquivo foi processado com sucesso e os dados inseridos.
 * @code {500} Se ocorrer um erro durante o processamento ou inserção dos dados.
 * @response {String} message Mensagem de sucesso após o processamento e inserção dos dados.
 */
router.post('/uploadPartidaTecnicos', upload.single('file'), (req, res) => {
    const fileRows = [];
    let isFirstLine = true;
    fs.createReadStream(req.file.path)
        .pipe(csvParser({ separator: ';', 
        headers: ['UF', 'Matrícula WFM', 'Nome', 'Ativo', 'Latitude', 'Longitude', 'Território de serviço: Nome', 'Cidade'] })) 
        .on('data', (row) => {
            if (isFirstLine) {
                isFirstLine = false; 
                return; 
            }
            const processedRow = {
                UF: row['UF'],
                Ativo: row['Ativo'] === 'VERDADEIRO' ? 1 : 0,
                Matricula: row['Matrícula WFM'],
                Nome: row['Nome'],
                Latitude: row['Latitude'],
                Longitude: row['Longitude'],
                Territorio_Servico_Nome: row['Território de serviço: Nome'],
                Cidade: row['Cidade'].toUpperCase()
            };

            fileRows.push(processedRow);
        })
        .on('end', () => {
            db.serialize(() => {
                let sql = db.prepare('INSERT INTO partida_tecnicos (UF, Matricula, Nome, Ativo, Latitude, Longitude, Territorio_Servico_Nome, Cidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

                for (const row of fileRows) {
                    sql.run(row.UF, row.Matricula, row.Nome, row.Ativo, row.Latitude, row.Longitude, row.Territorio_Servico_Nome, row.Cidade);
                }

                sql.finalize();
            });

            fs.unlinkSync(req.file.path);

            res.send('Arquivo CSV processado.');
        });
});

module.exports = router;