const express = require("express");
const app = express();
const pool = require("./connection_pool.js");


const PORT = 3000; //default node.js port

app.get("/api/health", async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1");

        res.status(200).json({
            status: "ok",
            database: "connected",
        })

    } catch(err) {
        res.status(500).json({
        status: "error",
        database: "disconnected",
        });

    }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});