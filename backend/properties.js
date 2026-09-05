const express = require("express");
const router = express.Router(); //
const pool = require("./connection_pool.js");


router.get("/", async(req, res) => {
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

        const formattedProperties = properties.map(row => ({
            ...row, // Keeps all original database fields intact just in case
            id: row.id || row.L_ListingID,
            price: row.L_SystemPrice,
            address: row.L_Address || row.UnparsedAddress,
            city: row.L_City,
            state: row.L_State,
            beds: row.L_Keyword2,
            baths: row.LM_Dec_3,
            sqft: row.L_SquareFeet,
            L_Photos: row.L_Photos
        }));

        res.status(200).json({
            total: total_count[0].total,
            results_length: properties.length,
            limit: LIMIT,
            offset: OFFSET,
            results: formattedProperties
        });




    } catch(err) {
        return res.status(500).json({
            status : "error",
            message : err.message
        });
    }

});

router.get("/:id/openhouses", async(req, res) => {
    const propertyId = req.params.id;
    if (!propertyId || propertyId.length !== 10 || isNaN(propertyId)) {
        return res.status(400).json({error: "Malformed or oversized ID"});
    }

    try {
        const propertyCheckQuery = `SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?`;
        const [properties] = await pool.query(propertyCheckQuery, [propertyId]);

        if (properties.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }


        let openhouse_query = `SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate ASC, OH_StartTime ASC`;
        const [rows] = await pool.query(openhouse_query, [propertyId]);
    
        res.status(200).json(rows);
    } catch(err) {
        console.error("Database error details:", err);
        return res.status(500).json({ error: "Internal Server Error" });

    }
});

router.get("/:id", async(req, res) => {
    const propertyId = req.params.id;
    if (!propertyId || propertyId.length !== 10 || isNaN(propertyId)) {
        return res.status(400).json({error: "Malformed or oversized ID"});
    }
    try{

        let db_query = `SELECT * FROM rets_property WHERE L_ListingID = ?`;
        const [rows] = await pool.query(db_query, [propertyId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }

        
        res.status(200).json(rows[0]);

    } catch(err) {
        console.error("Database error details:", err);
        return res.status(500).json({ error: "Internal Server Error" });

    }

});

module.exports = router;



