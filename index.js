const express = require("express");
const execute = require("child_process").execSync;
const app = express();

app.get("/contact-list", (req, res) => {
    const handleContacts = () => {
        return execute("termux-contact-list");
    };
    const contacts = JSON.stringify(handleContacts());
    res.send(contacts);
});

app.listen(8000);
console.log("Now listening on port 8000");
