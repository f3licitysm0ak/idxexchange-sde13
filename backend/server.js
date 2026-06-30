require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./connection_pool.js");


const PORT = 5000; //default node.js port is 3000, used 5000 from the project spec

app.get("/api/health", async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1");

        res.status(200).json({
            status: "ok",
            database: "connected",
        })

    } catch(err) {
        console.log("DB ERROR:", err);
        res.status(500).json({
        status: "error",
        database: "disconnected",
        });

    }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

