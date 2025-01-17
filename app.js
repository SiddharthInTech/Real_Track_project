const express = require('express')
const app = express()
const port = 4000;
const http = require("http");
const path = require('path');

const socketio = require("socket.io")

const server = http.createServer(app)

const io = socketio(server);


io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    })
    
    socket.on("disconnect", function (){
        io.emit("user-disconnected", socket.id);
    })
    
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))


app.get("/", function (req, res) {
    res.render("index");
})

console.log("my name is", process.env.myname);

server.listen(port, () => {
    console.log('port is connected at http://localhost:4000');
})