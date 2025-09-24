const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to AI-based Museum Artifact Info System" });
});

// Get all artifacts
app.get("/artifacts", (req, res) => {
  db.query("SELECT * FROM Artifacts", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Search artifact by name
app.get("/search/:name", (req, res) => {
  const { name } = req.params;
  db.query(
    "SELECT * FROM Artifacts WHERE name LIKE ?",
    [`%${name}%`],
    (err, results) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(results);
    }
  );
});

// Add new artifact
app.post("/add_artifact", (req, res) => {
  const { name, description, origin, year_estimated, category_id, image_url } =
    req.body;
  db.query(
    "INSERT INTO Artifacts (name, description, origin, year_estimated, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, origin, year_estimated, category_id, image_url],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: "Artifact added", id: result.insertId });
    }
  );
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
