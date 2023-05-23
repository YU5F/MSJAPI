const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db/messages");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/messages", async (req, res) => {
    const results = await db.insertMessage(req.body);
    res.status(201).json({ id: results[0] });
});

app.get("/messages", async (req, res) => {
    const messages = await db.getAllMessages();
    res.status(200).json({ messages });
});

app.patch("/messages/:id", async (req, res) => {
    const id = await db.updateMessage(req.params.id, req.body);
    res.status(200).json({ id });
});

app.listen(1337, () => console.log("server is running on port 1337"));