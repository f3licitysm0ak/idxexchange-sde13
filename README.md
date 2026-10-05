# IDX Exchange Summer 2026 Intern Project — Property Search Application

A full-stack real estate property search application inspired by Zillow/Redfin, built using React, Node.js/Express, and MySQL. The app allows users to search, filter, and view detailed MLS property listings, interactive maps, and open house schedules.

---

## Technical Stack

* **Frontend:** React, React Router, CSS3
* **Backend:** Node.js, Express
* **Database:** MySQL 8 running inside Docker
* **Testing:** Jest, React Testing Library, Supertest
> **Note:** The React client never queries the database directly. All property data, filtered searches, and open house events are served through the Express REST endpoints.

---

## Database Overview

The project relies on a local MySQL 8 database populated via two primary tables using RETS naming conventions:

1. **`rets_property`** — Stores listing details:
   * **Core fields:** `L_ListingID`, `L_Address`, `L_City`, `L_State`, `L_Zip`
   * **Pricing & Metrics:** `L_SystemPrice` (price), `L_Keyword2` (beds), `LM_Dec_3` (baths), `LM_Int2_3` (sqft)
   * **Media & Geospatial:** `L_Photos` (JSON array of image URLs), `LMD_MP_Latitude`, `LMD_MP_Longitude`
   * **Additional details:** `L_Remarks`, `YearBuilt`, `LotSizeAcres`

2. **`rets_openhouse`** — Stores upcoming open house event schedules:
   * **Foreign key:** `L_ListingID`
   * **Key columns:** `OpenHouseDate`, `OH_StartTime`, `OH_EndTime`, `all_data` (JSON blob containing additional remarks)

---

## Key Features

* **Property Search & Filtering:** Filter listings by price range, bedrooms, bathrooms, city, and zip code.
* **Pagination:** Server-side pagination handling bulk MLS data efficiently.
* **Detailed Listing View:** Image carousels, property specs, descriptions, and location coordinates.
* **Open House Schedules:** Live display of upcoming viewing times linked to individual property records.
* **REST API:** Modular Express endpoints handling queries, parameters, and error handling cleanly.
