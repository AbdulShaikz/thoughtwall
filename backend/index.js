const express = require('express');
const Database = require('better-sqlite3');

const app = express();

app.use(express.json());

const db = new Database('messages.db');
db.pragma('journal_mode = WAL')

db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     text TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);

const PORT = 5000
app.get('/', (req,res) => {
    return res.json({
        status: 'ok',
    })
});

app.post('/messages', (req,res) => {
    const {text} = req.body;
    if(!text || text.trim()===''){
        return res.status(400).json({error: 'Text is required'})
    }
    const stmt = db.prepare('INSERT INTO messages (text) VALUES (?)');
    const result = stmt.run(text.trim());
    const newMessage = db.prepare('SELECT * from messages WHERE id=?').get(result.lastInsertRowid);
    res.status(201).json(newMessage);
});

app.get('/messages', (req,res) => {
    const messages = db.prepare('SELECT * from messages ORDER BY created_at DESC').all();
    res.json(messages);
});


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})