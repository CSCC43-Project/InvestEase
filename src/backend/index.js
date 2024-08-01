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
        const firstPortfolio = await pool.query("INSERT INTO portfolio (userid, portfolioid, cash_account) VALUES ($1, $2, 0) RETURNING *", [count, 1])
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
            const friendCount = await pool.query("SELECT COUNT(*) FROM friends_list WHERE ownerID = $1 AND status = 'mut' GROUP BY ownerID", [id]);
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
            const friendsList = await pool.query("SELECT * FROM friends_list WHERE ownerID = $1 AND status = 'mut'", [id]);
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
            if (error.code === '23505') {
                try {
                    const { senderID, receiverID } = req.body;
                    const updateFriendRequest = await pool.query("UPDATE friend_request SET request_status = 'ipr', time_received = NOW() WHERE senderID = $1 AND receiverID = $2 RETURNING *", [senderID, receiverID]);
                    res.json(updateFriendRequest.rows[0]);
                } catch (error) {
                    console.error(error.message);
                }
            }
        }
    });
    // ? FriendRequest: accept friend request
    // INSERT INTO friends_list (ownerID, friendID) VALUES ($1, $2);
    // DELETE FROM friend_request WHERE senderID = $1 AND receiverID = $2
    app.post("/friendrequest/accept", async (req, res) => {
        try {
            const { ownerID, friendID } = req.body;
            const newFriend = await pool.query("INSERT INTO friends_list (ownerID, friendID, status, time_received) VALUES ($1, $2, 'mut', NOW()) RETURNING *", [ownerID, friendID]);
            const newFriend2 = await pool.query("INSERT INTO friends_list (ownerID, friendID, status, time_received) VALUES ($2, $1, 'mut', NOW()) RETURNING *", [ownerID, friendID]);
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
    app.put("/friendslist/delete", async (req, res) => {
        try {
            const { ownerID, friendID } = req.body;
            const deleteFriend = await pool.query("UPDATE friends_list SET status = 'del', time_received = NOW() WHERE ownerID = $1 AND friendID = $2", [ownerID, friendID]);
            const deleteFriend2 = await pool.query("UPDATE friends_list SET status = 'del', time_received = NOW() WHERE ownerID = $2 AND friendID = $1", [ownerID, friendID]);
            res.json("hi");
        } catch (error) {
            console.error(error.message);
        }
    });

    // ? Get All users - friends - already requested for search
    // GET ALL USERS - FRIENDS - ALREADY REQUESTED - REQUESTED IN THE LAST 5 MINUTES
    app.get("/searchfriends/:id", async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query("DELETE FROM friend_request WHERE request_status = 'rej' AND time_received <= (NOW() - INTERVAL '5 MINUTES')");
            await pool.query("DELETE FROM friends_list WHERE status = 'del' AND time_received <= (NOW() - INTERVAL '5 MINUTES')");
            const friends = await pool.query("(SELECT userid FROM users WHERE userid != $1 \
                EXCEPT SELECT friendid FROM friends_list WHERE ownerID = $1 \
                EXCEPT SELECT receiverid FROM friend_request WHERE senderid = $1\
                EXCEPT SELECT senderid FROM friend_request WHERE request_status = 'rej')", [id]);
            res.json(friends.rows);
        } catch (error) {
            console.error(error.message);
        }
    });

// ! USERS PORTFOLIOS
    // ? Portfolio: Create new portfolio
    // INSERT INTO portfolios (userid, portfolio_name, cash_account) VALUES ($1, $2, $3) RETURNING *;
    app.post('/portfolios/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { portfolioid } = req.body;
            const newPortfolio = await pool.query('INSERT INTO portfolio (userid, portfolioid, cash_account) VALUES ($1, $2, 0) RETURNING *', [id, portfolioid]);
            res.json(newPortfolio.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
    app.get("/getportfolios/:uid/:portfolioid", async (req, res) => {
        try {
            const { uid, portfolioid } = req.params;
            const portfolio = await pool.query("SELECT * FROM portfolio WHERE userid = $1 AND portfolioid != $2", [uid, portfolioid]);
            res.json(portfolio.rows);
        } catch (error) {
            console.error(error.message);
        }
    });
    app.get("/portfoliocount/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const portfolioCount = await pool.query("SELECT COUNT(*) FROM portfolio WHERE userid = $1", [id]);
            res.json(portfolioCount.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });
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
    // INSERT INTO transaction (portfolioid, userid, stock_symbol, timestamp, time_of_purchase, total_cost, num_shares_purchased) VALUES ($1, $2, $3, $4, now(), $5, $6) RETURNING *;
    app.post('/stockholding/:portfolioid/:userid', async (req, res) => {
        try {
            const { portfolioid, userid } = req.params;
            const { stock_symbol, timestamp, num_shares } = req.body;
            const newStockHolding = await pool.query('INSERT INTO stock_holding (portfolioid, userid, stock_symbol, timestamp, num_shares) VALUES ($1, $2, $3, $4, $5) RETURNING *', [portfolioid, userid, stock_symbol, timestamp, num_shares]);
            res.json(newStockHolding.rows[0]);
        } catch (error) {
            console.error(error.message);
        }
    });

// ! Transactions
// ? Transaction: Get all transactions
app.get("/transactions/:portfolioid/:userid", async (req, res) => {
    try {
        const { portfolioid, userid } = req.params;
        const allTransactions = await pool.query("SELECT * FROM transaction WHERE portfolioid = $1 AND userid = $2", [portfolioid, userid]);
        res.json(allTransactions.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// ? Transaction: Post a transaction
app.post("/transactions", async (req, res) => {
    try {
        const { portfolioid, userid, stock_symbol, timestamp, total_cost, num_shares } = req.body;
        const newTransaction = await pool.query("INSERT INTO transaction (portfolioid, userid, stock_symbol, timestamp, time_of_purchase, total_cost, num_shares_purchased) VALUES ($1, $2, $3, $4, now(), $5, $6) RETURNING *", [portfolioid, userid, stock_symbol, timestamp, total_cost, num_shares]);
        res.json(newTransaction.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

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

app.get('/marketinfo/:portfolioid/:userid', async (req, res) => {
    try {
        const { portfolioid, userid } = req.params;
        const marketInfo = await pool.query('select portfolioid, userid, stock_symbol, stocks.timestamp, num_shares, close from stock_holding join stocks on stock_holding.stock_symbol = stocks.symbol WHERE (stocks.timestamp, close) = (SELECT timestamp, close FROM stocks WHERE symbol = stock_holding.stock_symbol ORDER BY timestamp DESC LIMIT 1) AND portfolioid = $1 AND userid = $2', [portfolioid, userid]);
        res.json(marketInfo.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// ? Add stock to stocks
// INSERT INTO stocks (symbol, timestamp, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
app.post('/addstocks', async (req, res) => {
    try {
        const { symbol, open, high, low, close, volume } = req.body;
        const newStock = await pool.query('INSERT INTO stocks (symbol, timestamp, open, high, low, close, volume) VALUES ($1, NOW(), $2, $3, $4, $5, $6) RETURNING *', [symbol, open, high, low, close, volume]);
        res.json(newStock.rows[0]);
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
        const stockLists = await pool.query('SELECT stocklistid FROM stock_list WHERE ownerid = $2 AND is_public = true UNION SELECT stocklistid from shared_stock_list WHERE shared_userid = $1 AND ownerid = $2', [uid, ownerid]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.put(`/updatevolume/:symbol`, async (req, res) => {
    try {
        const { symbol } = req.params;
        const { volume } = req.body;
        const updateVolume = await pool.query('UPDATE stocks SET volume = volume + $2 WHERE symbol = $1 RETURNING *', [symbol, volume]);
        res.json(updateVolume.rows);
    } catch (error) {
        console.message(error)
    }
});

app.get('/publicstocklists/:ownerid', async (req, res) => {
    try {
        const { ownerid } = req.params;
        const stockLists = await pool.query('SELECT stocklistid FROM stock_list WHERE ownerid = $1 AND is_public = true', [ownerid]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/sharedstocklists/:uid/:ownerid/', async (req, res) => {
    try {
        const { ownerid, uid } = req.params;
        const stockLists = await pool.query('SELECT stocklistid FROM shared_stock_list WHERE ownerid = $1 AND shared_userid = $2', [ownerid, uid]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/ownersharedstocklists/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const stockLists = await pool.query('SELECT DISTINCT stocklistid FROM shared_stock_list WHERE ownerid = $1', [uid]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/privatestocklists/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const stockLists = await pool.query('SELECT stocklistid FROM stock_list WHERE ownerid = $1 AND is_public = false EXCEPT SELECT stocklistid FROM shared_stock_list WHERE ownerid = $1', [uid]);
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

app.get('/mystocklistinfo/:uid/:stocklistid', async (req, res) => {
    try {
        const { uid, stocklistid } = req.params;
        const stockList = await pool.query('SELECT * FROM stock_list WHERE ownerid = $1 AND stocklistid = $2', [uid, stocklistid]);
        res.json(stockList.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

app.put('/stocklists/updatevisibility/:userid/:stocklistid', async (req, res) => {
    try {
        const { userid, stocklistid } = req.params;
        const { is_public } = req.body;
        const updateStockList = await pool.query('UPDATE stock_list SET is_public = $1 WHERE stocklistid = $2 AND ownerid = $3 RETURNING *', [is_public, stocklistid, userid]);
        res.json(updateStockList.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/listvisibility/:ownerId/:listId', async (req, res) => {
    const { ownerId, listId } = req.params;
    const listVisibility = await pool.query('SELECT is_public FROM stock_list WHERE ownerid=$1 AND stocklistid=$2', [ownerId, listId]);
    res.json(listVisibility.rows[0])
});

// ? StockList: Add a stock_list
// INSERT INTO stock_list (ownerID, stocklistid, is_public) VALUES ($1, $2, $3) RETURNING *;
app.post('/stocklists/:ownerid', async (req, res) => {
    try {
        const { ownerid } = req.params;
        const { stocklistid } = req.body;
        const newStockList = await pool.query('INSERT INTO stock_list (ownerid, stocklistid, is_public) VALUES ($1, $2, FALSE) RETURNING *', [ownerid, stocklistid]);
        res.json(newStockList.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

app.delete('/stocklists/:ownerid/:stocklistid', async (req, res) => {
    try {
        const { ownerid, stocklistid } = req.params;
        const deleteStockList = await pool.query('DELETE FROM stock_list WHERE ownerid = $1 AND stocklistid = $2', [ownerid, stocklistid]);
        res.json(deleteStockList.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.post('/addstocklist/:listid/:userid', async (req, res) => {
    try {
        const { listid, userid } = req.params;
        const { stock_symbol, timestamp, num_shares } = req.body;
        const newStockListItem = await pool.query('INSERT INTO stock_list_item (stocklistid, ownerid, symbol, timestamp, num_shares) VALUES ($1, $2, $3, $4, $5) RETURNING *', [listid, userid, stock_symbol, timestamp, num_shares]);
        res.json(newStockListItem.rows[0]);
    } catch (error) { 
        console.error(error.message);
    }
});

app.delete('/deletestock/:uid/:listId/:symbol', async (req,res) => {
    try {
        const { uid, listId, symbol } = req.params;
        const deleteStock = await pool.query('DELETE FROM stock_list_item WHERE ownerid = $1 AND stocklistid = $2 AND symbol = $3 RETURNING *;', [uid, listId, symbol]);
        res.json(deleteStock.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

app.put('/addshare/:uid/:listId/:symbol', async (req, res) => {
    try {
        const { uid, listId, symbol } = req.params;
        const addShare = await pool.query('UPDATE stock_list_item SET num_shares = num_shares + 1 WHERE ownerid = $1 AND stocklistid = $2 AND symbol = $3', [uid, listId, symbol]);
        const stockLists = await pool.query('SELECT * FROM stock_list_item WHERE ownerid = $1 AND stocklistid = $2;', [uid, listId]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.put('/subshare/:uid/:listId/:symbol', async (req, res) => {
    try {
        const { uid, listId, symbol } = req.params;
        const getShares = await pool.query('SELECT num_shares FROM stock_list_item WHERE ownerid = $1 AND stocklistid = $2 AND symbol = $3', [uid, listId, symbol]);
        if(getShares.rows[0].num_shares == 0){
            res.status(400).json({response: "No stock left"});
        } else {
            const subShare = await pool.query('UPDATE stock_list_item SET num_shares = num_shares - 1 WHERE ownerid = $1 AND stocklistid = $2 AND symbol = $3', [uid, listId, symbol]);
            const stockLists = await pool.query('SELECT * FROM stock_list_item WHERE ownerid = $1 AND stocklistid = $2;', [uid, listId]);
            res.json(stockLists.rows);
        }
    } catch (error) {
        console.error(error.message);
    }
});

app.get("/stocklistcount/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const stockListCount = await pool.query("SELECT COUNT(*) FROM stock_list WHERE ownerid = $1", [id]);
        res.json(stockListCount.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});
// ? StockList: Get all stocklists for a specifc user that are public
// SELECT * FROM stock_list WHERE ownerID = $1 AND is_public = true;
// ? StockListItem: Get all stock_list_items from a specific user and stock list
// SELECT * FROM stock_list_item WHERE ownerID = $2 AND stocklistid = $3;
app.get('/stocklistitems/:ownerid/:stockListId', async (req, res) => {
    try {
        const { ownerid, stockListId } = req.params;
        const stockLists = await pool.query('SELECT * FROM stock_list_item WHERE ownerid = $1 AND stocklistid = $2;', [ownerid, stockListId]);
        res.json(stockLists.rows);
    } catch (error) {
        console.error(error.message);
    }
});
// ? StockListItem: Add an item to a specific stock_list
// INSERT INTO stock_list_items (stocklistid, ownerid, stock_symbol, stock_timestamp, num_shares) VALUES ($1, $2, $3, $4, $5) RETURNING *;
app.post("stocklistitem/:stocklistid/:ownerid", async (req, res) => {
    try {
        const { stocklistid, ownerid } = req.params;
        const { stock_symbol, stock_timestamp, num_shares } = req.body;
        const newStockListItem = await pool.query("INSERT INTO stock_list_item (stocklistid, ownerid, stock_symbol, stock_timestamp, num_shares) VALUES ($1, $2, $3, $4, $5) RETURNING *", [stocklistid, ownerid, stock_symbol, stock_timestamp, num_shares]);
        res.json(newStockListItem.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

// ! SHAREDSTOCKLIST PAGE
// ? SharedStockList: Get all of the friends of the owner of the stocklist - friends that the stocklist is already shared with
app.get('/sharedstocklist/:stocklistid/:ownerid', async (req, res) => {
    try {
        const { stocklistid, ownerid } = req.params;
        const sharedStockList = await pool.query("SELECT friendid FROM friends_list WHERE ownerid = $2 AND status = 'mut' EXCEPT SELECT shared_userid FROM shared_stock_list WHERE stocklistid = $1 AND ownerid = $2", [stocklistid, ownerid]);
        res.json(sharedStockList.rows);
    } catch (error) {
        console.error(error.message);
    }
});
// ? SharedStockList: Share a stocklist with a friend
app.post("/sharedstocklist/:stocklistid/:ownerid", async (req, res) => {
    try {
        const { stocklistid, ownerid } = req.params;
        const { shared_userid } = req.body;
        const newSharedStockList = await pool.query("INSERT INTO shared_stock_list (stocklistid, ownerid, shared_userid) VALUES ($1, $2, $3) RETURNING *", [stocklistid, ownerid, shared_userid]);
        res.json(newSharedStockList.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/isshared/:stocklistid/:ownerid', async (req, res) => {
    try {
        const { stocklistid, ownerid } = req.params;
        const sharedStockList = await pool.query("SELECT COUNT(*) FROM shared_stock_list WHERE ownerid = $2 AND stocklistid = $1", [stocklistid, ownerid]);
        res.json(sharedStockList.rows[0].count > 0);
    } catch (error) {
        console.error(error.message);
    }
});

// ! REVIEW PAGE
app.get('/ownerreviews/:ownerid/:stockListId', async (req, res) => {
    try {
        const { ownerid, stockListId } = req.params;
        const reviews = await pool.query(
            'SELECT users.username, review.review_text FROM review JOIN users ON review.reviewerid = users.userid WHERE review.ownerid = $1 AND review.stocklistid = $2;'
            , [ownerid, stockListId]);
        res.json(reviews.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/reviews/:ownerid/:stocklistid', async (req, res) => {
    try {
        const { ownerid, stocklistid } = req.params;
        const reviews = await pool.query('select reviewerid, stocklistid, ownerid, review_text, username, profilepic_url from review join users on review.reviewerid = users.userid WHERE review.stocklistid = $2 and review.ownerid = $1;', [ownerid, stocklistid]);
        res.json(reviews.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.post('/addreview', async (req, res) => {
    try {
        const { reviewerid, stocklistid, ownerid, review_text} = req.body;
        const reviews = await pool.query('INSERT INTO review (reviewerid, stocklistid, ownerid, review_text) VALUES ($1, $2, $3, $4) RETURNING *', [reviewerid, stocklistid, ownerid, review_text]);
        res.status(200).json({response: "review added"});
    } catch (error) {
        console.error(error.message);
    }
});

app.put("/updateReview", async (req, res) => {
    try {
        const { reviewerid, stocklistid, ownerid, review_text } = req.body;
        const updateReview = await pool.query("UPDATE review SET review_text = $4 WHERE reviewerid = $1 AND stocklistid = $2 AND ownerid =$3", [reviewerid, stocklistid, ownerid, review_text]);
        res.json({response: "review updated"});
    } catch (error) {
        console.error(error.message);
    }
});

app.delete('/reviews/:ownerid/:stocklistid/:reviewerid', async (req, res) => {
    try {
        const { ownerid, stocklistid, reviewerid } = req.params;
        const deleteReview = await pool.query('DELETE FROM review WHERE ownerid = $1 AND stocklistid = $2 AND reviewerid = $3', [ownerid, stocklistid, reviewerid]);
        res.json(deleteReview.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.delete("/allreviews/:ownerid/:stocklistid", async (req, res) => {
    try{
        const { ownerid, stocklistid } = req.params;
        const deleteReviews = await pool.query('DELETE FROM review WHERE ownerid = $1 AND stocklistid = $2', [ownerid, stocklistid]);
        res.json(deleteReviews.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get("/myreview/:ownerid/:listid/:myid", async (req, res) => {
    try{
        const { ownerid, listid, myid } = req.params;
        const getReview = await pool.query('SELECT * FROM review WHERE ownerid = $1 AND stocklistid = $2 AND reviewerid = $3', [ownerid, listid, myid]);
        res.json(getReview.rows);
    } catch (error) {
        console.error(error.message);
    }
});

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

// ! GRAPHING

app.get('/graphingWeek/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const timestamp = await pool.query("SELECT timestamp FROM stocks WHERE symbol = $1 ORDER BY timestamp DESC LIMIT 1", [symbol]);
        const stock = await pool.query("SELECT timestamp, close, symbol FROM stocks WHERE timestamp <= $2 AND timestamp >= $2 - INTERVAL '7 DAYS' AND symbol= $1", [symbol, timestamp.rows[0].timestamp]);
        res.json(stock.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/graphingMonth/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const timestamp = await pool.query("SELECT timestamp FROM stocks WHERE symbol = $1 ORDER BY timestamp DESC LIMIT 1", [symbol]);
        const stock = await pool.query("SELECT timestamp, close, symbol FROM stocks WHERE timestamp <= $2 AND timestamp >= $2 - INTERVAL '1 MONTH' AND symbol= $1", [symbol, timestamp.rows[0].timestamp]);
        res.json(stock.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/graphingQuarter/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const timestamp = await pool.query("SELECT timestamp FROM stocks WHERE symbol = $1 ORDER BY timestamp DESC LIMIT 1", [symbol]);
        const stock = await pool.query("SELECT timestamp, close, symbol FROM stocks WHERE timestamp <= $2 AND timestamp >= $2 - INTERVAL '3 MONTHS' AND symbol= $1", [symbol, timestamp.rows[0].timestamp]);
        res.json(stock.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/graphingYear/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const timestamp = await pool.query("SELECT timestamp FROM stocks WHERE symbol = $1 ORDER BY timestamp DESC LIMIT 1", [symbol]);
        const stock = await pool.query("SELECT timestamp, close, symbol FROM stocks WHERE timestamp <= $2 AND timestamp >= $2 - INTERVAL '1 YEAR' AND symbol= $1", [symbol, timestamp.rows[0].timestamp]);
        res.json(stock.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/graphing5Years/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const timestamp = await pool.query("SELECT timestamp FROM stocks WHERE symbol = $1 ORDER BY timestamp DESC LIMIT 1", [symbol]);
        const stock = await pool.query("SELECT timestamp, close, symbol FROM stocks WHERE timestamp <= $2 AND timestamp >= $2 - INTERVAL '5 YEARS' AND symbol= $1", [symbol, timestamp.rows[0].timestamp]);
        res.json(stock.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// ! NEW STUFF
// GET COEFFICIENT OF VARIATION FOR ALL STOCKS
app.get('/statistics', async (req, res) => {
    try {
        const statistics = await pool.query("SELECT symbol,(STDDEV_POP(close) / AVG(close)) AS coefficient_of_variation FROM stocks \
WHERE timestamp BETWEEN (SELECT timestamp FROM stocks WHERE symbol = symbol ORDER BY timestamp ASC LIMIT 1) AND now() GROUP BY symbol");
        res.json(statistics.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// GET COEFFICIENT OF VARIATION FOR A SPECIFIC STOCK
app.get('/statistics/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const statistics = await pool.query("SELECT symbol,(STDDEV_POP(close) / AVG(close)) AS coefficient_of_variation FROM stocks \
WHERE (timestamp BETWEEN (SELECT timestamp FROM stocks WHERE symbol = symbol ORDER BY timestamp ASC LIMIT 1) AND now()) AND symbol = $1 GROUP BY symbol", [symbol]);
        res.json(statistics.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

// BETA COEFFICIENT
app.get('/beta/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const covariance = await pool.query("WITH returns AS (SELECT timestamp, symbol AS asset_symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))/ LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS asset_return FROM stocks WHERE symbol = $1 UNION ALL SELECT timestamp, 'MARKET' as asset_symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp)) / LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS asset_return FROM stocks WHERE symbol IN (SELECT DISTINCT symbol FROM stocks)), mean_returns AS (SELECT asset_symbol, AVG(asset_return) AS mean_return FROM returns GROUP BY asset_symbol), returns_with_means AS (SELECT r.timestamp, r.asset_symbol, r.asset_return, m.mean_return AS mean_return FROM returns r JOIN mean_returns m ON r.asset_symbol = m.asset_symbol) SELECT SUM((r.asset_return - r.mean_return) * (m.asset_return - m.mean_return)) / (COUNT(*) - 1) AS covariance FROM returns_with_means r JOIN returns_with_means m ON r.timestamp = m.timestamp WHERE r.asset_symbol = $1 AND m.asset_symbol = 'MARKET'", [symbol])
        const variance = await pool.query("WITH market_returns AS (SELECT timestamp, symbol AS asset_symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))/ LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS return FROM stocks WHERE symbol IN (SELECT DISTINCT symbol FROM stocks)), mean_market_return AS (SELECT AVG(return) AS mean_return FROM market_returns) SELECT SUM((return - m.mean_return) * (return - m.mean_return)) / (COUNT(*) - 1) AS variance FROM market_returns r JOIN mean_market_return m ON true");
        res.json(covariance.rows[0].covariance / variance.rows[0].variance);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/marketValue', async (req, res) => {
    try {
        const marketValue = await pool.query("WITH stock_returns AS (SELECT timestamp, symbol, close, LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS prev_close,(close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp)) / LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS stock_return FROM stocks), stock_weights AS (SELECT timestamp, symbol, (close * volume) AS market_cap, SUM(close * volume) OVER (PARTITION BY timestamp) AS total_market_cap FROM stocks), weights AS (SELECT timestamp, symbol, market_cap / total_market_cap AS weight FROM stock_weights), market_returns AS (SELECT sr.timestamp, SUM(sr.stock_return * w.weight) AS market_return FROM stock_returns sr Join weights w ON sr.timestamp = w.timestamp AND sr.symbol = w.symbol GROUP BY sr.timestamp) SELECT timestamp, market_return FROM market_returns ORDER BY timestamp");
        res.json(marketValue.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/dailyReturns/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const dailyreturns = await pool.query("SELECT timestamp, (close - LAG(close) OVER (ORDER BY timestamp)) / LAG(close) OVER (ORDER BY timestamp) AS stock_return FROM stocks WHERE symbol = $1", [symbol]);
        res.json(dailyreturns.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/covariance/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const covariance = await pool.query("WITH returns AS (SELECT timestamp, symbol AS asset_symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))/ LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS asset_return FROM stocks WHERE symbol = $1 UNION ALL SELECT timestamp, 'MARKET' as asset_symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp)) / LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS asset_return FROM stocks WHERE symbol IN (SELECT DISTINCT symbol FROM stocks)), mean_returns AS (SELECT asset_symbol, AVG(asset_return) AS mean_return FROM returns GROUP BY asset_symbol), returns_with_means AS (SELECT r.timestamp, r.asset_symbol, r.asset_return, m.mean_return AS mean_return FROM returns r JOIN mean_returns m ON r.asset_symbol = m.asset_symbol) SELECT SUM((r.asset_return - r.mean_return) * (m.asset_return - m.mean_return)) / (COUNT(*) - 1) AS covariance FROM returns_with_means r JOIN returns_with_means m ON r.timestamp = m.timestamp WHERE r.asset_symbol = $1 AND m.asset_symbol = 'MARKET'", [symbol])
        res.json(covariance.rows[0].covariance);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/variance', async (req, res) => {
    try {
        const variance = await pool.query("WITH market_returns AS (SELECT timestamp, symbol AS asset_symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))/ LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS return FROM stocks WHERE symbol IN (SELECT DISTINCT symbol FROM stocks)), mean_market_return AS (SELECT AVG(return) AS mean_return FROM market_returns) SELECT SUM((return - m.mean_return) * (return - m.mean_return)) / (COUNT(*) - 1) AS variance FROM market_returns r JOIN mean_market_return m ON true");
        res.json(variance.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/cov/:s1/:s2', async (req, res) => {
    try {
        const { s1, s2 } = req.params;
        const cov = await pool.query("WITH returns AS (SELECT timestamp, symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))/ LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS daily_return FROM stocks WHERE symbol IN ($1, $2)), mean_returns AS (SELECT symbol, AVG(daily_return) AS mean_return FROM returns GROUP BY symbol), returns_with_means AS (SELECT r.timestamp, r.symbol, r.daily_return, m.mean_return FROM returns r JOIN mean_returns m ON r.symbol = m.symbol) SELECT SUM((r1.daily_return - m1.mean_return) * (r2.daily_return - m2.mean_return)) / (COUNT(*) - 1) AS covariance FROM returns_with_means r1 JOIN returns_with_means r2 ON r1.timestamp = r2.timestamp JOIN mean_returns m1 ON r1.symbol = m1.symbol JOIN mean_returns m2 ON r2.symbol = m2.symbol WHERE r1.symbol = $1 AND r2.symbol = $2", [s1, s2]);
        res.json(cov.rows[0].covariance);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/corr/:s1/:s2', async (req, res) => {
    try {
        const { s1, s2 } = req.params;
        const corr = await pool.query("WITH returns AS (SELECT timestamp, symbol, (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))/ LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) AS daily_return FROM stocks WHERE symbol IN ($1, $2)), mean_returns AS (SELECT symbol, AVG(daily_return) AS mean_return FROM returns GROUP BY symbol), returns_with_means AS (SELECT r1.timestamp, r1.daily_return AS return1, r2.daily_return AS return2, m1.mean_return AS mean_return1, m2.mean_return AS mean_return2 FROM returns r1 JOIN returns r2 ON r1.timestamp = r2.timestamp JOIN mean_returns m1 ON r1.symbol = m1.symbol JOIN mean_returns m2 ON r2.symbol = m2.symbol WHERE r1.symbol = $1 AND r2.symbol = $2), covariance AS (SELECT SUM((return1 - mean_return1) * (return2 - mean_return2)) / (COUNT(*) - 1) AS covar FROM returns_with_means), stddevs AS (SELECT SQRT(SUM((return1 - mean_return1) * (return1 - mean_return1)) / (COUNT(*) - 1)) AS stddev1, SQRT(SUM((return2 - mean_return2) * (return2 - mean_return2)) / (COUNT(*) - 1)) AS stddev2 FROM returns_with_means) SELECT c.covar / (s.stddev1 * s.stddev2) AS correlation FROM covariance c, stddevs s", [s1, s2]);
        res.json(corr.rows[0].correlation);
    } catch (error) {
        console.error(error.message);
    }
});