const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/api/files", (req, res) => {
  const dir = req.query.dir || "./logs";
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to read directory" });
    const logFiles = files.filter(
      (file) => file.endsWith(".log") || file.endsWith(".txt")
    );
    res.json(logFiles);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
