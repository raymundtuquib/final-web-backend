const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect(err => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// Routes
app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/todos", (req, res) => {
  const { task } = req.body;
  db.query(
    "INSERT INTO todos (task, status) VALUES (?, ?)",
    [task, "pending"],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, task, status: "pending" });
    }
  );
});


app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  db.query(
    "UPDATE todos SET task=? WHERE id=?",
    [task, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Todo updated successfully" });
    }
  );
});


app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM todos WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Todo deleted successfully" });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
