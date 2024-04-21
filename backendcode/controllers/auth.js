

require('dotenv').config();
const cors = require('cors')
const mysql = require('mysql2');

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


// blogControllers.js

const pool = require('../db'); // Assuming you have your database connection pool defined in a separate file

//generate token 
function generateToken(mobile){
    const secret_key = process.env.secret_key
    return jwt.sign(mobile, secret_key);
}


//loing function 
const login = (req, res) => {
    const { mobile, password } = req.body;
    const sql = "SELECT * FROM signup WHERE mobile = ? AND password = ?";
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: "Database connection failed" });
        }

        connection.query(sql, [mobile, password], (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                return res.status(500).json({ message: "Login failed" });
            }

            if (results.length > 0) {
                const token = generateToken(mobile); // Assuming you have this function defined to generate a token
        
                // Send token as response
                res.status(200).json({ token: token });
            } else {
                res.status(401).json({ error: 'Invalid credentials or user does not exist' });
            }
        });
    });
};

const signup = (req, res) => {
    console.log("singup ")
    const { name, mobile, password } = req.body;
    const query = 'INSERT INTO signup (name, mobile, password) VALUES (?, ?, ?)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error occurred during signup:", err);
            res.status(500).json({ message: "Signup failed" });
            return;
        }

        connection.query(query, [name, mobile, password], (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.error("Error occurred during signup:", error);
                res.status(500).json({ message: "Signup failed" });
            } else {
                console.log("Signup successful");
                res.status(200).json({ message: "Signup successful" });
            }
        });
    });
};

module.exports = { 
    login,
     signup 
    };
