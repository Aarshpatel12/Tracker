const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
  console.log("A user connected: ", socket.id);

  // Emit the location data for the user who just connected
  socket.on("send-location", function(data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // Handle user disconnection
  socket.on("disconnect", function() {
    io.emit("user-disconnected", socket.id);
    console.log("User disconnected: ", socket.id);
  });
});

app.get("/", function(req, res) {
  res.render("index");
});

server.listen(7000, () => console.log("Server running on port 7000"));
