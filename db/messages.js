const knex = require("./knex");

function insertMessage(msg, table){
    table = "108OsmanMuv-114AhmetAv";
    return knex(table).insert(msg);
}

function getAllMessages(table){
    table = "108OsmanMuv-114AhmetAv";
    return knex(table).select("*");
}

function updateMessage(id, table){
    table = "108OsmanMuv-114AhmetAv";
    return knex(table).where("Id", id).update(table);
}

module.exports = {
    insertMessage,
    getAllMessages,
    updateMessage
}