# IDX Exchange Summer 2026 Intern Project — Property Search Application

A full-stack real estate property search application inspired by Zillow/Redfin, built using React, Node.js/Express, and MySQL. The app allows users to search, filter, and view detailed MLS property listings, interactive maps, and open house schedules.

---

## Technical Stack

* **Frontend:** React, React Router, CSS3
* **Backend:** Node.js, Express
* **Database:** MySQL 8 containerized with Docker
* **Testing:** Jest, React Testing Library, Supertest
> **Note:** The React client never queries the database directly. All property data, filtered searches, and open house events are served through the Express REST endpoints.

---

## Key Features

* **Property Search & Filtering:** Filter listings by price range, bedrooms, bathrooms, city, and zip code.
* **Pagination:** Server-side pagination handling bulk MLS data efficiently.
* **Detailed Listing View:** Image carousels, property specs, descriptions, and location coordinates.
* **Open House Schedules:** Live display of upcoming viewing times linked to individual property records.
* **REST API:** Modular Express endpoints handling queries, parameters, and error handling cleanly.
