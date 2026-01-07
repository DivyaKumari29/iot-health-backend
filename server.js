const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://divya190206_db_user:0nM5N6TL3Cg30aOZ@iot-cluster.hczitdt.mongodb.net/?appName=iot-cluster"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const HealthSchema = new mongoose.Schema({
  hr: Number,
  spo2: Number,
  time: { type: Date, default: Date.now }
});

const Health = mongoose.model("Health", HealthSchema);

app.post("/insert", async (req, res) => {
  const { hr, spo2 } = req.body;
  if (!hr || !spo2) {
    return res.status(400).send("Missing data");
  }
  await Health.create({ hr, spo2 });
  res.send("OK");
});

// 🔹 GET latest reading (for cards)
app.get("/latest", async (req, res) => {
  try {
    const latest = await Health.findOne().sort({ time: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 GET all readings (for graph + table)
app.get("/data", async (req, res) => {
  try {
    const data = await Health.find().sort({ time: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/", (req, res) => {
  res.send("IoT Cloud is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
