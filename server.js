const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

//connect Database
connectDB();

//Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Request"));

//Defining Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/users"));
app.use("/api/requests", require("./routes/api/request"));
app.use("/api/content", require("./routes/api/coreTheoryContent"));
app.use("/api/mail", require("./routes/api/mail"));
app.use("/api/services", require("./routes/api/service"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on Port ${PORT}`));
