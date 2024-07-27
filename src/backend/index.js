const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

// ! REGISTER PAGE
app.post('/registerUser', async (req, res) => {
    try {
        const { email, username, password, profile_pic } = req.body;
        const count = (await pool.query('SELECT * FROM users;')).rowCount + 1;
        
        const checkEmail = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if(checkEmail.rowCount > 0){
            return res.status(400).json({message: "This email is being used."})
        }

        const user = await pool.query("INSERT INTO users (userid, email, profilepic_url, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [count, email, profile_pic, username, password]);
        res.json({response: `${username} added successfully`});
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
            return res.status(400).json({ response: "Email or Password Missing."});
        }

        const user = (await pool.query("SELECT userid, email, password FROM users WHERE email = $1", [email])).rows[0];

        if(password === user.password){
            return res.status(200).json({ response: "Successful login.", userid: user.userid});
        } else {
            return res.status(401).json({ response: "Email or Password invalid."})
        }
    } catch (error) {
        console.error(error.message);
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

// ! USERS PORTFOLIOS
    // ? Portfolio: Create new portfolio
    // INSERT INTO portfolios (userid, portfolio_name, cash_account) VALUES ($1, $2, $3) RETURNING *;
    // ? Portfolio: Get all portfolios
    // SELECT * FROM portfolios WHERE userid = $1;
    // ? Portfolio: Get specific portfolios
    // SELECT * FROM portfolios WHERE userid = $1 AND portfolio_id = $2;
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2 AND stock_symbol = $3 AND s;
    // ? Portfolio: Update cash account --> withdraw/deposit
    // UPDATE portfolios SET cash_account = $1 WHERE userid = $2 AND portfolio_id = $3 RETURNING *;
    // ? StockHolding: Get all Stock Holdings
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2;
    // ? StockHolding: Get specific Stock Holding
    // SELECT * FROM stock_holding WHERE portfolio_id = $1 AND userid = $2 AND stock_symbol = $3 AND timestamp = $4;
    // SELECT close from stocks WHERE symbol = $1 AND timestamp = $2;
    // ? StockHolding: Add stock to portfolio
    // INSERT INTO stock_holding (portfolio_id, userid, stock_symbol, timestamp, time_of_purchase, num_shares) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;

// ! STOCKS PAGE
// SELECT * FROM stocks WHERE symbol = $1 AND timestamp = $2;
    // ? View statistics of a specifc stock
    // SELECT close FROM stocks WHERE symbol = $1;

// ! STOCKLIST PAGE
// ? StockList: Get all stock_list from a specific user
// SELECT * FROM stock_list WHERE ownerID = $1;
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
// ? User: Get user info
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

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});