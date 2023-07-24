const express = require("express");
const execute = require("child_process").execSync;
const app = express();

const corsMiddleware = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://192.168.1.11:5173");
    res.header(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, PUT, PATCH, POST, DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, X-Requested-With, Authorization"
    );
    next();
};

app.use(corsMiddleware);

app.get("/get-contacts", (req, res) => {
    res.send(`${execute("termux-contact-list")}`);
});

app.get("/get-messages", (req, res) => {
    res.send(`${execute("termux-sms-list -d -n -t all")}`);
});

app.listen(8000);
console.log("Now listening on port 8000");
