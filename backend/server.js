require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./connection_pool.js");


const PORT = 5000; //default node.js port is 3000, used 5000 from the project spec

const propertiesRouter = require("./properties.js");

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });

  next();
});

app.use("/api/properties", propertiesRouter); //mounting properties router. anything starting with /api/properties goes to the routes in properties.js

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


