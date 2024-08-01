const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: '34.130.101.124',
    port: 5432,
    database: 'mydb'
});

module.exports = pool;