const knex = require("knex");

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "Messages.db"
    }
});

module.exports = connectedKnex;