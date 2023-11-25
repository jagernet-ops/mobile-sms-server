const express = require("express");
const execute = require("child_process").execSync;
const app = express();
const get = require("lodash");
const os = require("os");

const corsMiddleware = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
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
app.use(express.json());
app.use(corsMiddleware);

app.get("/get-contacts", (req, res) => {
    res.send(`${execute("termux-contact-list")}`);
});

app.get("/get-messages", (req, res) => {
    res.send(`${execute("termux-sms-list -d -n -t all")}`);
});

app.post("/send-single-message", (req, res) => {
    execute(
        `termux-sms-send -n ${req.body["phoneNumber"]} ${req.body["messageVal"]}`
    );
    res.status(200).end();
});

//Make group message and multiple number message

app.listen(8000);

const parseNetworkInterface = (body) => {
    let ipV4Address = "";
    ipV4Address = body["wlan0"].filter(
        (interface) => interface["family"] === "IPv4"
    )[0]["address"];
    return ipV4Address;
};
console.log(
    `Now listening at ${parseNetworkInterface(os.networkInterfaces())}:8000`
);
