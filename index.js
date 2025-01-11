const express = require("express");
const swaggerStats = require("swagger-stats");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Swagger Stats middleware
app.use(
  swaggerStats.getMiddleware({
    swaggerSpec: require("./swagger.json"), // Load Swagger JSON
    swaggerDefinition: {
      info: {
        title: "API Stats Example",
        description: "Example for Swagger Stats integration",
        version: "1.0.0",
      },
      basePath: "/",
    },
    onInit: function () {
      console.log("swagger-stats initialized");
    },
  })
);

// Route to render the input form
app.get("/", (req, res) => {
  res.render("index", { result: null });
});

// Route to handle form submission
app.post("/submit", (req, res) => {
  const userData = req.body;
  console.log("Form data received:", userData);

  // Here you can process the form data as needed (e.g., save it to a database)
  
  // After submission, redirect to Swagger Stats page
  res.redirect("/swagger-stats");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/swagger-stats/ to view API stats.`);
});
