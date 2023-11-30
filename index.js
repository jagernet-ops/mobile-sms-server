const express = require("express");
const execute = require("child_process").execSync;
const app = express();
const os = require("os");
const ws = require("ws");

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

const wss = new ws.WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    ws.send("Welcome to the notifications relay!");
});
let blacklistedNotifications = [];

app.get("/get-contacts", (req, res) => {
    res.send(`${execute("termux-contact-list")}`);
});

app.get("/get-messages", (req, res) => {
    const contact = req.query.contact;
    console.log(blacklistedNotifications);
    if (contact) {
        const data = execute(
            `termux-sms-list -l 99999 -d -n -t all -f ${contact}`
        );
        const textUpdate = execute("termux-notification-list").filter(
            ({ id }) => id === 123 // Android uses custom id's for application notifications and my messenger's id is 123
        );
        if (textUpdate && !blacklistedNotifications.includes(textUpdate.when)) {
            wss.clients.forEach((ws) => {
                ws.send("New Messages!");
            });
            blacklistedNotifications.push(textUpdate);
        }
        res.send(data);
    } else {
        const data = execute(`termux-sms-list -l 99999 -d -n -t all`);
        res.send(data);
    }
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
