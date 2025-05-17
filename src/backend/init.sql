CREATE DATABASE investease;

CREATE TABLE Users (userID INT PRIMARY KEY, email VARCHAR(32) NOT
NULL, profilepic_url VARCHAR(200) DEFAULT
'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5
eD7wYws.jpg', username VARCHAR(32), password VARCHAR(40) NOT NULL);

CREATE TABLE Friends_List(ownerID INT, friendID INT, status CHAR(3),
time_received TIMESTAMP, PRIMARY KEY(ownerID, friendID));

CREATE TABLE Friend_Request(senderID INT, receiverID INT, request_status
CHAR(3) DEFAULT 'ipr', time_received TIME, PRIMARY KEY(senderID,
receiverID));

CREATE TABLE Portfolio(portfolioID INT, userID INT, cash_account REAL,
PRIMARY KEY(portfolioID, userID));

CREATE TABLE Stock_Holding(portfolioID INT, userID INT, stock_symbol
VARCHAR(5), timestamp DATE, num_shares INT, PRIMARY KEY(portfolioID,
userID, stock_symbol, timestamp));

CREATE TABLE Transaction(portfolioID INT, userID INT, stock_symbol
VARCHAR(5), timestamp DATE, time_of_purchase TIME, total_cost REAL,
num_shares_purchased INT, PRIMARY KEY(portfolioID, userID, stock_symbol,
timestamp, time_of_purchase));

CREATE TABLE Stock_List(stocklistID INT, ownerID INT, is_public BOOLEAN,
PRIMARY KEY(ownerID, stocklistID));

CREATE TABLE Stock_List_Item(stocklistID INT, ownerID INT, symbol
VARCHAR(5), timestamp DATE, num_shares INT, PRIMARY KEY(ownerID,
stocklistID, symbol, timestamp));

CREATE TABLE Review(reviewerID INT, stocklistID INT, ownerID INT, review_text
VARCHAR(4000), PRIMARY KEY(reviewerID, ownerID, stocklistID));

COPY Stocks(timestamp, open, high,
low, close, volume, symbol) FROM '.../SP500History.csv' DELIMITER ','
CSV HEADER;