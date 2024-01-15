const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: '',
    password: '',
    database: 'socket_io',
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;