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

        //get requested limit and offset + setting the defaults as appropriate 
        let LIMIT = req.query.limit ? Number(req.query.limit) : 20;
        let OFFSET = req.query.offset ? Number(req.query.offset) : 0;

        if (isNaN(LIMIT) || isNaN(OFFSET) || LIMIT <= 0 || LIMIT >= 200){
            return res.status(400).json({
                message: "Invalid filter value"
            });
        }

        const filtersMap = new Map([
            ['city', 'L_City'],
            ['zipcode', 'L_Zip'],
            ['beds', 'L_Keyword2'],
            ['baths', 'LM_Dec_3']
        ]);

        let whereClauses = [];
        let values = [];

        for (const [key, value] of filtersMap) {
            if (req.query[key] !== undefined) {
                //replace the whereClauses push thingy with pushing key and value separately so no sql injection
                whereClauses.push(`${value} = ?`);
                values.push(req.query[key]);
            }
        }

        
        if (req.query.minPrice !== undefined) {
            if (isNaN(req.query.minPrice)) {
                return res.status(400).json({
                    message: "Invalid filter value"
                });
            }
            //sql injection-proof replacement
            whereClauses.push("L_SystemPrice >= ?");
            values.push(req.query.minPrice);
        }

        if (req.query.maxPrice !== undefined) {
            if (isNaN(req.query.maxPrice)) {
                return res.status(400).json({
                    message: "Invalid filter value"
                });
            }
            //sql injection-proof replacement
            whereClauses.push("L_SystemPrice <= ?");
            values.push(req.query.maxPrice);
        }

        if (req.query.beds && isNaN(Number(req.query.beds))) {
            return res.status(400).json({
                message: "Invalid filter value"
            });
        }
        if (req.query.baths && isNaN(Number(req.query.baths))) {
            return res.status(400).json({
                message: "Invalid filter value"
            });
        }

        let whereClause = " WHERE " + whereClauses.join(" AND "); //added spaces so L_City = "Chicago" AND L_Zip = 83948 instead of L_City = "Chicago"ANDL_Zip = 83948 
        if (whereClauses.length === 0) {
            whereClause = "";
        }

        let countQuery = `SELECT COUNT(*) AS total FROM rets_property ${whereClause}`;
        let filteredQuery = `SELECT * FROM rets_property ${whereClause} ORDER BY id LIMIT ${LIMIT} OFFSET ${OFFSET}`; //making sure the order is proper of SELECT then WHERE then ORDER BY

        
        const [total_count] = await pool.query(countQuery, values);
        const [properties] = await pool.query(filteredQuery, values);


        res.status(200).json({
            total: total_count[0].total,
            results_length: properties.length,
            limit: LIMIT,
            offset: OFFSET,
            results: properties
        });




    } catch(err) {
        return res.status(500).json({
            status : "error",
            message : err.message
        });
    }

});


