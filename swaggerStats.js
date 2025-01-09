

const express = require("express");
const swaggerStats = require("swagger-stats");

const app = express();

// Initialize swagger-stats middleware for API observability
app.use(
  swaggerStats.getMiddleware({
    swaggerSpec: require('./swagger.json'), // Path to your Swagger/OpenAPI spec file
    swaggerDefinition: {
      info: {
        title: "API Stats Example",
        description: "Example for Swagger Stats integration",
        version: "1.0.0"
      },
      basePath: "/"
    },
    onInit: function () {
      console.log("swagger-stats initialized");
    }
  })
);

// Sample API routes
app.get("/", (req, res) => {
  res.send("Welcome to the API observability example!");
});

app.post("/submit", (req, res) => {
  res.json({ message: "Data received", receivedData: req.body });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Visit http://localhost:3000/swagger-stats/ to view API stats.");
});
