app.get("/api/properties", async(req, res) => {
    try {

        //get requested limit and offset + setting the defaults as appropriate 
        let LIMIT = req.query.limit ? Number(req.query.limit) : 20;
        let OFFSET = req.query.offset ? Number(req.query.offset) : 0;

        if (isNaN(LIMIT) || isNaN(OFFSET) || LIMIT <= 0 || LIMIT >= 200){
            //res 400 status
        }

        const filtersMap = new Map([
            ['city', 'L_City'],
            ['zipcode', 'L_Zip'],
            ['beds', 'L_Keyword2'],
            ['baths', 'LM_Dec_3']
        ]);

        let whereClauses = [];

        for (const [key, value] of filtersMap) {
            if (req.query[key] !== undefined) {
                whereClauses.push(`${value} = "${req.query[key]}"`); //add "" before the key bc that's the actual string value of query param
            }
        }

        
        if (req.query.minPrice) {
            if (isNaN(req.query.minPrice)) {
                //res status 400
            }
            whereClauses.push(`SystemPrice >= ${req.query.minPrice}`);
        }

        if (req.query.maxPrice) {
            if (isNaN(req.query.maxPrice)) {
                //res status 400
            }
            whereClauses.push(`SystemPrice <= ${req.query.maxPrice}`);
        }

        if (req.query.beds && isNaN(Number(req.query.beds))) {
            //res status 400
        }
        if (req.query.baths && isNaN(Number(req.query.baths))) {
            //res status 400
        }

        let whereClause = " WHERE " + whereClauses.join(" AND "); //added spaces so L_City = "Chicago" AND L_Zip = 83948 instead of L_City = "Chicago"ANDL_Zip = 83948 
        if (whereClauses.length === 0) {
            whereClause = "";
        }
        let filteredQuery = `SELECT * FROM rets_property ${whereClause} ORDER BY id LIMIT ${LIMIT} OFFSET${OFFSET}`; //making sure the order is proper of SELECT then WHERE then ORDER BY
        

        const [properties] = await pool.query(filteredQuery);


        res.status(200).json({
            total: properties.length,
            limit: LIMIT,
            offset: OFFSET,
            results: properties
        });




    } catch(err) {
        res.status(500).json({
            status : "error",
            message : err.message
        });
    }

});