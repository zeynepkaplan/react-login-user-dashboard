const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1234",
    database: "postgres"
});

client.connect();

// GET /api/data - Veritabanındaki tüm kullanıcıları getirir
app.get('/api/data', (req, res) => {
    client.query('SELECT * FROM newtable', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

// POST /add/data - Yeni bir kullanıcı ekler
app.post('/add/data', (req, res) => {
    const { id, name, email, username, role, company_name } = req.body;

    const query = `INSERT INTO newtable (id, name, email, username, role, company_name) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [id, name, email, username, role, company_name];

    client.query(query, values, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(result.rows[0]); // Eklenen kullanıcıyı geri döndür
        }
    });
});

// POST /delete/data - Seçili kullanıcıları siler
app.post('/delete/data', (req, res) => {
    const ids = req.body.ids;
    const query = `DELETE FROM newtable WHERE id = ANY($1::int[])`;

    client.query(query, [ids], (err, result) => {
        if (!err) {
            res.status(200).json({ message: 'Users deleted successfully' });
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});


// POST /login - Giriş doğrulaması yapar
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    client.query('SELECT * FROM newtable WHERE email = $1 AND password = $2', [email, password], (err, result) => {
        if (!err && result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'E-posta veya parola hatalı' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});







