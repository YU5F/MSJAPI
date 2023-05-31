const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("Messages.db");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const createTableIfNotExists = (tableName, callback) => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
        if (err) {
            console.error(err);
            callback(err);
            return;
        }

        if (!row) {
            // Table does not exist, create the table
            db.run(
                `CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            senderKey TEXT,
            receiverKey TEXT,
            message TEXT,
            sentDate TEXT
          )`,
                (err) => {
                    if (err) {
                        console.error(err);
                        callback(err);
                        return;
                    }
                    callback(null);
                }
            );
        } else {
            callback(null);
        }
    });
};

// POST method for sending a message
app.post('/messages', (req, res) => {
    const { senderKey, receiverKey, message } = req.body;
    const tableName = [senderKey, receiverKey].sort().join('_');
    const currentDate = new Date().toLocaleString();

    db.run(
        `INSERT INTO ${tableName} (senderKey, receiverKey, message, sentDate) VALUES (?, ?, ?, ?)`,
        [senderKey, receiverKey, message, currentDate],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json({ message: `Message inserted successfully in table ${tableName}` });
        }
    );
});

// GET method for retrieving messages
app.get('/messages', (req, res) => {
    const { senderKey, receiverKey } = req.query;
    const tableName = [senderKey, receiverKey].sort().join('_');

    createTableIfNotExists(tableName, (err) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            if (rows.length === 0) {
                res.json({ message: 'The chatting session has begun' });
            } else {
                res.json({ messages: rows });
            }
        });
    });
});


app.listen(1337, () => console.log("server is running on port 1337"));