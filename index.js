const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Create server
const app = express();

// Connect to db
connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions));

console.log(`Initializing Server`);

const port = process.env.PORT || 4000;

// Enable read values of body
app.use(express.json());

// Enable public folder
app.use(express.static("uploads"));

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/links", require("./routes/links"));
app.use("/api/files", require("./routes/files"));

// Initialize app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
