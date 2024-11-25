const express = require("express");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files like CSS and JS
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// File upload setup using multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Home route to render the index.ejs template
app.get("/", (req, res) => {
  res.render("index", { hash: null, error: null });
});

// Route for file upload and hash generation
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.render("index", { hash: null, error: "No file uploaded!" });
  }

  // Generate SHA-256 hash
  const hash = crypto.createHash("sha256");
  hash.update(req.file.buffer);
  const hashedValue = hash.digest("hex");

  // Return the generated hash to the template
  res.render("index", { hash: hashedValue, error: null });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
