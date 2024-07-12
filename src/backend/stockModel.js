// import { Pool } from 'pg';
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'postgres',
    port: 5432,
});

pool.connect();
pool.query('SELECT * FROM Stocks', (err, res) => {
    console.log(err, res);
    pool.end();
});

//get all merchants our database
// const getStocks = async () => {
//   try {
//     return await new Promise(function (resolve, reject) {
//       pool.query("SELECT * FROM Stocks", (error, results) => {
//         if (error) {
//           reject(error);
//         }
//         if (results && results.rows) {
//           resolve(results.rows);
//         } else {
//           reject(new Error("No results found"));
//         }
//       });
//     });
//   } catch (error_1) {
//     console.error(error_1);
//     throw new Error("Internal server error");
//   }
// };

// module.exports = {
//   getStocks
// };