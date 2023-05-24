const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("Messages.db");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/messages", async (req, res) => {
    const { senderKey, recieverKey, message } = req.body;
    const tableName = [senderKey, recieverKey].sort().join('_');

    const currentDate = new Date();

    // Format the date as "yyyy-mm-dd"
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Format the time as "hh:mm"
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    const date = `${year}-${month}-${day} ${hours}:${minutes}`;

    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (!row) {
            db.run(
                `CREATE TABLE IF NOT EXISTS ${tableName} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    senderKey TEXT,
                    receiverKey TEXT,
                    message TEXT,
                    sentDate TEXT
                )`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }

                db.run(
                    `INSERT INTO ${tableName} (senderKey, receiverKey, message, sentDate) VALUES (?, ?, ?, ?)`,
                    [senderKey, recieverKey, message, date],
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
        } else {
            db.run(
                `INSERT INTO ${tableName} (senderKey, receiverKey, message, sentDate) VALUES (?, ?, ?, ?)`,
                [senderKey, recieverKey, message, date],
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }
                    res.json({ message: `Message inserted successfully in table ${tableName}` });
                }
            );
        }
    });
});

app.get("/messages", (req, res) => {
    const { senderKey, recieverKey } = req.body;
    const tableName = [senderKey, recieverKey].sort().join('_');
    console.log(tableName);
  
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
  
      if (!row) {
        // Table does not exist, return default value
        res.json({ messages: [] });
      } else {
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json({ messages: rows });
        });
      }
    });
  });

app.listen(1337, () => console.log("server is running on port 1337"));