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

app.get("/api/properties", async(req, res) => {
    try {

        if (req.query.limit) {
            LIMIT = `LIMIT ${limit}`;
        }
        if (req.query.offset) {
            OFFSET = `OFFSET ${offset}`;
        }
        
        const properties = await pool.query(`SELECT * FROM rets_property ORDER BY id ${LIMIT} ${OFFSET}`);

        const filtersMap = new Map([
            ['city', 'L_City'],
            ['zipcode', 'L_Zip']
        ]);

        for (const [key, value] of filtersMap) {
            if (req.query[key] !== undefined) {
                query = query.where(value, '==', req.query[key]);
            }
        }



    } catch(err) {

    }

});

