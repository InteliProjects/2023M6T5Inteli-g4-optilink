const sqlite3 = require('sqlite3').verbose();

// Use __dirname para obter o diretório atual do script
const dbPath = `${__dirname}/../bd/bd_vital.db`;

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados');
        
    }
});

module.exports = db;
