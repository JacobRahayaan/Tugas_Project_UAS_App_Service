const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/posts.routes");

const app = express();

// Load Swagger YAML dari file yang sama dengan app.js
const swaggerDocument = YAML.load("./swagger.yaml");

app.use(cors());
app.use(express.json());

// Swagger endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
