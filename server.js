const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// GET all fare records
app.get("/api/data", (req, res) => {
  fs.readFile("./backend/db.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading database" });
    res.json(JSON.parse(data));
  });
});

// POST fare transaction
app.post("/calculateFare", (req, res) => {
  const { cardId, from, to } = req.body;

  if (!cardId || !from || !to) {
    return res.status(400).json({ msg: "Invalid input" });
  }

  // Load users
  const usersFile = "./backend/users.json";
  let users = {};
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  if (!users[cardId]) return res.status(400).json({ msg: "Card not linked to bank" });

  const stops = ["Vijayawada", "Guntur", "Nellore", "Tirupati"];
  const distance = Math.abs(stops.indexOf(from) - stops.indexOf(to)) * 50;
  const fare = distance * 2;

  if (users[cardId].balance < fare) return res.status(400).json({ msg: "Insufficient balance" });

  // Deduct balance
  users[cardId].balance -= fare;
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  // Save transaction to db.json
  const record = { cardId, from, to, fare, time: new Date().toLocaleString() };
  const dbFile = "./backend/db.json";
  let db = [];
  if (fs.existsSync(dbFile)) db = JSON.parse(fs.readFileSync(dbFile));
  db.push(record);
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

  res.json({ msg: "Payment successful", fare, balance: users[cardId].balance });
});

// POST bank linking
app.post("/linkBank", (req, res) => {
  const { cardId, bankAcc, pin } = req.body;
  if (!cardId || !bankAcc || !pin) return res.status(400).json({ msg: "Invalid input" });

  const usersFile = "./backend/users.json";
  let users = {};
  if (fs.existsSync(usersFile)) users = JSON.parse(fs.readFileSync(usersFile));

  const balance = Math.floor(Math.random() * 1500) + 500;
  users[cardId] = { bankAcc, pin, balance };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({ msg: "Bank linked successfully", balance });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
