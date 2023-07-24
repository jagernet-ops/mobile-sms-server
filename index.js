const express = require("express");
const execute = require("child_process").execSync;
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/get-contacts", (req, res) => {
    res.send(`${execute("termux-contact-list")}`);
});

app.get("/get-messages", (req, res) => {
    res.send(`${execute("termux-sms-list -d -n -t all")}`);
});

app.post("/send-message", cors(), (req, res) => {});

app.listen(8000);
console.log("Now listening on port 8000");
