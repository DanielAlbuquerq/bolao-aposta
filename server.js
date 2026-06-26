const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

const db = new sqlite3.Database('./bolao.db', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado ao banco de dados SQLite.');
});

db.run(`CREATE TABLE IF NOT EXISTS apostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    apelido TEXT,
    gols_br INTEGER NOT NULL,
    gols_jp INTEGER NOT NULL
)`);

// Rota para LER todas as apostas
app.get('/api/apostas', (req, res) => {
    db.all(`SELECT * FROM apostas ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Rota para SALVAR nova aposta
app.post('/api/apostas', (req, res) => {
    const { nome, apelido, gols_br, gols_jp } = req.body;
    const query = `INSERT INTO apostas (nome, apelido, gols_br, gols_jp) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [nome, apelido, gols_br, gols_jp], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// NOVA ROTA: Para DELETAR uma aposta pelo ID
app.delete('/api/apostas/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM apostas WHERE id = ?`, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Aposta excluída com sucesso" });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});