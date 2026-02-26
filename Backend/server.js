require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ FIXED: correct folder casing
const User = require("./models/User");
const Event = require("./models/Event");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


/* ===== TEST ROUTE ===== */
app.get("/", (_req, res) => {
  res.send("Backend is working!");
});

// Utility
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ======================
   AUTH
====================== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ======================
   EVENTS CRUD
====================== */

// Get events for a user
app.get("/events/:userId", async (req, res) => {
  try {
    const events = await Event.find({ userId: req.params.userId });
    res.json(events);
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add event
app.post("/events", async (req, res) => {
  try {
    const { name, location, userId } = req.body;

    if (!name || !location || !userId) {
      return res.status(400).json({
        message: "Name, location, and userId are required",
      });
    }

    const event = new Event({ name, location, userId });
    const saved = await event.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("Add event error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update event
app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const updated = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete event
app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ======================
   DATABASE + SERVER START
====================== */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected via .env");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });