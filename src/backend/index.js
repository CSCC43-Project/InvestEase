const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

// ! REGISTER PAGE
app.get('/registerUser', async (req, res) => {
    try {
        const { email, username, password, profile_pic } = req.params;
        // const count = (await pool.query('SELECT * FROM users;')).rowCount;
        // const user = await pool.query("INSERT INTO users (userid, email, username, password, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *", [count+1, email, username, password, profile_pic]);
        return res.json({message: `${email} successfully registered.`});
    } catch (error) {
        console.error(error.message);
    }
});

// ! LOGIN PAGE
app.get('/checkLogin', async (req, res) => {
    try {
        const { email, password } = req.params;
        const user = await pool.query('SELECT * FROM users WHERE email == $1 AND password == &2');
        //res.json(email == user.email && password == user.password);
    } catch (error) {
        console.error(error.message);
    }
});

// ! PROFILE PAGE
// SELECT username FROM users WHERE userid = $1;
// SELECT profile_pic FROM users WHERE userid = $1;
// SELECT COUNT(*) FROM friends_list WHERE ownerID = $1 GROUP BY ownerID;
    // ? FriendsList
    // SELECT * FROM friends_list WHERE ownerID = $1;
    // ? FriendRequest: incoming
    // SELECT * FROM friend_requests WHERE receiverID = $1;
    // ? FriendRequest: outgoing
    // SELECT * FROM friend_requests WHERE senderID = $1;
    // ? FriendRequest: send/receive
    // INSERT INTO friend_requests (senderID, receiverID) VALUES ($1, $2);

// ! USERS PORTFOLIOS
    // ? Portfolio: Create new portfolio
    // INSERT INTO portfolios (userid, portfolio_name, cash_account) VALUES ($1, $2, $3) RETURNING *;
    // ? Portfolio: Get all portfolios
    // SELECT * FROM portfolios WHERE userid = $1;
    // ? Portfolio: Get specific portfolios
    // SELECT * FROM portfolios WHERE userid = $1 AND portfolio_id = $2;
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2 AND stock_symbol = $3 AND s;
    // ? StockHolding: Get all Stock Holdings
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2;
    // ? StockHolding: Get specific Stock Holding
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2 AND stock_symbol = $3 AND timestamp = $4;
    // ? StockHolding: Add stock to portfolio
    // INSERT INTO stock_holding (portfolio_id, userid, stock_symbol, timestamp, time_of_purchase, num_shares) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    // * I'm not sure what else we need to do for the stock holding table



    // get all users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});