const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: '34.130.9.79',
    port: 5432,
    database: 'mydb'
});

module.exports = pool;