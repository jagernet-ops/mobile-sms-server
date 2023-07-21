const express = require("express");
const execute = require("child_process").execSync;
const app = express();

app.get("/contact-list", (req, res) => {
    res.send(`${execute("termux-contact-list")}`);
});

app.listen(8000);
console.log("Now listening on port 8000");
