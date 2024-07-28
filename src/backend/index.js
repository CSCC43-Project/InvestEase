const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

// ! REGISTER PAGE
// SELECT * FROM users;
// SELECT email FROM users WHERE email = $1
// INSERT INTO users (userid, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *;
app.post('/registerUser', async (req, res) => {
    try {
        const { email, profilePic, username, password } = req.body;

        if( !email || !username || !password ){
            return res.status(400).json({ response: "Email or Username or Password Missing." });
        }

        const count = (await pool.query('SELECT * FROM users;')).rowCount + 1;
        
        const checkEmail = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if(checkEmail.rowCount > 0){
            return res.status(400).json({response: "This email is being used."})
        }

        const checkUsername = await pool.query("SELECT username FROM users WHERE username = $1", [username]);
        if(checkUsername.rowCount > 0){
            return res.status(400).json({response: "This username is being used."})
        }

        if(!profilePic){
            const user = await pool.query("INSERT INTO users (userid, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *;", [count, email, username, password]);
        } else {
            const user = await pool.query("INSERT INTO users (userid, email, profilepic_url, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [count, email, profilePic, username, password]);
        }
        res.json({response: `${username} added successfully`, userid: count});
    } catch (error) {
        console.error(error.message);
    }
});

// ! LOGIN PAGE
// SELECT * FROM users WHERE email = $1 AND password = $2;
app.post('/checkLogin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if( !email || !password ){
            return res.status(400).json({ response: "Email or Password Missing." });
        }

        const checkEmail = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if(checkEmail.rowCount === 0){
            return res.status(400).json({ response: "Email or Password invalid." })
        }

        const user = (await pool.query("SELECT userid, email, password FROM users WHERE email = $1", [email])).rows[0];

        if(password === user.password){
            return res.status(200).json({ response: "Successful login.", userid: user.userid });
        } else {
            return res.status(400).json({ response: "Email or Password invalid." })
        }
    } catch (error) {
        return console.error(error.message);
    }
});

// ! PROFILE PAGE
    // * Get Username
    // SELECT username FROM users WHERE userid = $1;
    app.get('/username/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const username = await pool.query('SELECT username FROM users WHERE userid = $1', [id]);
            res.json(username.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
    // * Get Profile Pic
    // SELECT profile_pic FROM users WHERE userid = $1;
    app.get('/profilepic/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const profilePic = await pool.query('SELECT profilepic_url FROM users WHERE userid = $1', [id]);
            res.json(profilePic.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
    // * Get Friend Count
    // SELECT COUNT(*) FROM friends_list WHERE ownerID = $1 GROUP BY ownerID;
    app.get('/friendcount/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const friendCount = await pool.query('SELECT COUNT(*) FROM friends_list WHERE ownerID = $1 GROUP BY ownerID', [id]);
            res.json(friendCount.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });

// ! PROFILE PAGE
// SELECT username FROM users WHERE userid = $1;
// SELECT profile_pic FROM users WHERE userid = $1;
// SELECT COUNT(*) FROM friends_list WHERE ownerID = $1 GROUP BY ownerID;
    // ? FriendsList
    // * Get User's Friends
    // SELECT * FROM friends_list WHERE ownerID = $1;
    app.get('/friendslist/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const friendsList = await pool.query('SELECT * FROM friends_list WHERE ownerID = $1', [id]);
            res.json(friendsList.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? FriendRequest: incoming
    // SELECT * FROM friend_request WHERE receiverID = $1;
    app.get('/friendslist/incoming/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const friendRequests = await pool.query('SELECT * FROM friend_request WHERE receiverID = $1', [id]);
            res.json(friendRequests.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? FriendRequest: outgoing
    // SELECT * FROM friend_requests WHERE senderID = $1;
    app.get('/friendslist/outgoing/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const friendRequests = await pool.query('SELECT * FROM friend_request WHERE senderID = $1', [id]);
            res.json(friendRequests.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? FriendRequest: send/receive friend request
    // INSERT INTO friend_requests (senderID, receiverID) VALUES ($1, $2);
    app.post("/friendrequest", async (req, res) => {
        try {
            const { senderID, receiverID } = req.body;
            const newFriendRequest = await pool.query("INSERT INTO friend_request (senderID, receiverID, time_received) VALUES ($1, $2, NOW()) RETURNING *", [senderID, receiverID]);
            res.json(newFriendRequest.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? FriendRequest: accept friend request
    // INSERT INTO friends_list (ownerID, friendID) VALUES ($1, $2);
    // DELETE FROM friend_request WHERE senderID = $1 AND receiverID = $2
    app.post("/friendrequest/accept", async (req, res) => {
        try {
            const { ownerID, friendID } = req.body;
            const newFriend = await pool.query("INSERT INTO friends_list (ownerID, friendID) VALUES ($1, $2) RETURNING *", [ownerID, friendID]);
            const newFriend2 = await pool.query("INSERT INTO friends_list (ownerID, friendID) VALUES ($2, $1) RETURNING *", [ownerID, friendID]);
            const deleteRequest = await pool.query("DELETE FROM friend_request WHERE senderID = $1 AND receiverID = $2", [friendID, ownerID]);
            res.json(newFriend.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? FriendRequest: decline friend request from incoming
    // UPDATE friend_request SET request_status = 'rej', time_received = NOW() WHERE senderID = $1 AND receiverID = $2;
    app.put("/friendrequest/decline", async (req, res) => {
        try {
            const { senderID, receiverID } = req.body;
            const declineRequest = await pool.query("UPDATE friend_request SET request_status = 'rej', time_received = NOW() WHERE senderID = $1 AND receiverID = $2", [senderID, receiverID]);
            res.json(declineRequest.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? FriendRequest: cancel friend request from outgoing
    // DELETE FROM friend_request WHERE senderID = $1 AND receiverID = $2;
    app.delete("/friendrequest/cancel", async (req, res) => {
        try {
            const { senderID, receiverID } = req.body;
            const cancelRequest = await pool.query("DELETE FROM friend_request WHERE senderID = $1 AND receiverID = $2", [senderID, receiverID]);
            res.json(cancelRequest.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? FriendList: delete mutual friend
    // DELETE FROM friends_list WHERE ownerID = $1 AND friendID = $2;
    // DELETE FROM friends_list WHERE ownerID = $2 AND friendID = $1;
    app.delete("/friendslist/delete", async (req, res) => {
        try {
            const { ownerID, friendID } = req.body;
            const deleteFriend = await pool.query("DELETE FROM friends_list WHERE ownerID = $1 AND friendID = $2", [ownerID, friendID]);
            const deleteFriend2 = await pool.query("DELETE FROM friends_list WHERE ownerID = $2 AND friendID = $1", [ownerID, friendID]);
            res.json(deleteFriend.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });

    // ? Get All users - friends - already requested for search
    // SELECT * FROM users WHERE userid = $1 EXCEPT SELECT * FROM friends_list WHERE ownerID = $1;
    app.get("/searchfriends/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const friends = await pool.query("SELECT userid FROM users WHERE userid != $1 EXCEPT SELECT friendid FROM friends_list WHERE ownerID = $1 EXCEPT SELECT receiverid FROM friend_request WHERE senderid = $1", [id]);
            res.json(friends.rows);
        } catch (error) {
            console.error(error.message);
        }
    });

// ! USERS PORTFOLIOS
    // ? Portfolio: Create new portfolio
    // INSERT INTO portfolios (userid, portfolio_name, cash_account) VALUES ($1, $2, $3) RETURNING *;
    // ? Portfolio: Get all portfolios
    // SELECT * FROM portfolios WHERE userid = $1;
    app.get('/portfolios/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const portfolios = await pool.query('SELECT * FROM portfolio WHERE userid = $1', [id]);
            res.json(portfolios.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? Portfolio: Get specific portfolios
    // SELECT * FROM portfolios WHERE userid = $1 AND portfolioid = $2;
    app.get('/portfolios/:portfolioid/:id', async (req, res) => {
        try {
            const { id, portfolioid } = req.params;
            const portfolios = await pool.query('SELECT * FROM portfolio WHERE userid = $1 AND portfolioid = $2', [id, portfolioid]);
            res.json(portfolios.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? StckHolding: Get all stock holdings for a portfolio
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2;
    app.get('/stockholdings/:portfolioid/:userid', async (req, res) => {
        try {
            const { portfolioid, userid } = req.params;
            const stockHoldings = await pool.query('SELECT * FROM stock_holding WHERE portfolioid = $1 AND userid = $2', [portfolioid, userid]);
            res.json(stockHoldings.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? Portfolio: Update cash account --> withdraw/deposit/buy/sell
    // UPDATE portfolios SET cash_account = $1 WHERE userid = $2 AND portfolio_id = $3 RETURNING *;
    app.put('/portfolios/:portfolioid/:userid', async (req, res) => {
        try {
            const { portfolioid, userid } = req.params;
            const { cash_account } = req.body;
            const updateCashAccount = await pool.query('UPDATE portfolio SET cash_account = $1 WHERE userid = $2 AND portfolioid = $3 RETURNING *', [cash_account, userid, portfolioid]);
            res.json(updateCashAccount.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? StockHolding: Update number of shares
    // UPDATE stock_holding SET num_shares = $1 WHERE portfolio_id = $2 AND userid = $3 AND stock_symbol = $4 AND timestamp = $5 RETURNING *;
    app.put('/stockholding/:portfolioid/:userid', async (req, res) => {
        try {
            const { portfolioid, userid } = req.params;
            const { num_shares, stock_symbol, timestamp } = req.body;
            const updateCashAccount = await pool.query('UPDATE stock_holding SET num_shares = $1 WHERE userid = $2 AND portfolioid = $3 AND stock_symbol = $4 AND timestamp = $5 RETURNING *', [num_shares, userid, portfolioid, stock_symbol, timestamp]);
            res.json(updateCashAccount.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    // ? StockHolding: Get all Stock Holdings
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2;
    // ? StockHolding: Get specific Stock Holding
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2 AND stock_symbol = $3 AND timestamp = $4;
    // SELECT close from stocks WHERE symbol = $1 AND timestamp = $2;
    // ? StockHolding: Add stock to portfolio
    // INSERT INTO stock_holding (portfolio_id, userid, stock_symbol, timestamp, time_of_purchase, num_shares) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;

// ! STOCKS PAGE
// SELECT * FROM stocks WHERE symbol = $1 AND timestamp = $2;
app.get('/stocks/:symbol/:timestamp', async (req, res) => {
    try {
        const { symbol, timestamp } = req.params;
        const stock = await pool.query('SELECT * FROM stocks WHERE symbol = $1 AND timestamp = $2', [symbol, timestamp]);
        res.json(stock.rows);
    } catch (error) {
        console.error(error.message);
    }
});
// ? Get all stocks with the latest stock price for each stock
// SELECT DISTINCT ON (symbol) * FROM stocks ORDER BY symbol, timestamp DESC;
app.get('/lateststocks', async (req, res) => {
    try {
        const stocks = await pool.query('SELECT DISTINCT ON (symbol) * FROM stocks ORDER BY symbol, timestamp DESC');
        res.json(stocks.rows);
    } catch (error) {
        console.error(error.message);
    }
});
// ? Get the latest stock price
// SELECT close FROM stocks WHERE symbol = $1 ORDER BY timestamp DESC LIMIT 1;
app.get('/lateststocks/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const stock = await pool.query('SELECT * FROM stocks WHERE symbol = $1 ORDER BY timestamp DESC LIMIT 1', [symbol]);
        res.json(stock.rows);
    } catch (error) {
        console.error(error.message);
    }
});
    // ? View statistics of a specifc stock
    // SELECT close FROM stocks WHERE symbol = $1;

// ! STOCKLIST PAGE
// * User Page: get all stock lists from a user that are public union all stock lists from a specific user that are shared with the logged in user
// SELECT stocklistid FROM stock_list WHERE ownerid = $2 AND is_public = 't' UNION SELECT stocklistid from shared_stock_list WHERE shared_userid = $1;
app.get('/stocklists/:uid/:ownerid', async (req, res) => {
    try {
        const { uid, ownerid } = req.params;
        const stockLists = await pool.query('SELECT stocklistid FROM stock_list WHERE ownerid = $2 AND is_public = true UNION SELECT stocklistid from shared_stock_list WHERE shared_userid = $1', [uid, ownerid]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// ? StockList: Get all stock_list from a specific user
// SELECT * FROM stock_list WHERE ownerID = $1;
app.get('/stocklists/:ownerid', async (req, res) => {
    try {
        const { ownerid } = req.params;
        const stockLists = await pool.query('SELECT * FROM stock_list WHERE ownerid = $1', [ownerid]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// ? StockList: Add a stock_list
// INSERT INTO stock_list (ownerID, stocklistid, is_public) VALUES ($1, $2, $3) RETURNING *;
// ? StockList: Get all stocklists for a specifc user that are public
// SELECT * FROM stock_list WHERE ownerID = $1 AND is_public = true;
// ? StockListItem: Get all stock_list_items from a specific user and stock list
// SELECT * FROM stock_list_item WHERE ownerID = $2 AND stocklistid = $3;
// ? StockListItem: Add an item to a specific stock_list
// INSERT INTO stock_list_items (stocklistid, ownerid, stock_symbol, stock_timestamp, num_shares) VALUES ($1, $2, $3, $4, $5) RETURNING *;

// ! SHAREDSTOCKLIST PAGE


// ! REVIEW PAGE



// ! USERS
// ? Get all users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (error) {
        console.error(error.message);
    }
});
// ? User: Get user info by ID
    // SELECT * FROM users WHERE userid = $1;
    app.get('/users/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const user = await pool.query('SELECT * FROM users WHERE userid = $1', [id]);
            res.json(user.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
// ? User: Get user info by username
    // SELECT * FROM users WHERE username = $1;
    app.get('/users/username/:username', async (req, res) => {
        try {
            const { username } = req.params;
            const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            res.json(user.rows);
        } catch (error) {
            console.error(error.message);
        }
    });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});