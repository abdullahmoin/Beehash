const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 50 * 1024 * 1024 }, // Max upload size: 50MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only PNG, JPG, and JPEG formats are allowed!"));
        }
        cb(null, true);
    },
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { hash: null, error: null });
});

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.render("index", { hash: null, error: "No file uploaded!" });
    }

    try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        fs.unlinkSync(req.file.path);

        res.render("index", { hash, error: null });
    } catch (err) {
        res.render("index", { hash: null, error: "An error occurred!" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
