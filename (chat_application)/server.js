const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", function (socket) {
    let username;
    socket.on("newuser", function (name) {
        username = name;
        socket.broadcast.emit("update", username +" "+" joined the conversation");
    });
    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
    });
    socket.on("exituser", function () {
        socket.broadcast.emit("update", username +" "+" left the conversation");
    });
    socket.on("disconnect", function () {
        if (username) {
            socket.broadcast.emit("update", username + " left the conversation");
        }
    });
});

server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
