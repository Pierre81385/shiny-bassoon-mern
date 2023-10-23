const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http"); // Require the http module
const socketIo = require("socket.io"); // Require the socket.io module

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
}); // Initialize Socket.IO with the server

const UserRouter = require("./routes/UsersAPI");
const RoomRouter = require("./routes/RoomsAPI");

app.use("/users", UserRouter);
app.use("/rooms", RoomRouter);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const online = [];
// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected");

  //notify of user login
  socket.on("Login", function (data) {
    console.log("a user connected");
    online.push(data.username);
    io.emit("Notify_Login", online);
  });

  socket.on("Logout", function (data) {
    console.log("a user disconnected");
    const index = online.indexOf(data.username);
    if (index > -1) {
      online.splice(index, 1);
    }
    io.emit("Notify_Logout", online);
  });

  // direct message real-time updates
  socket.on("DM_Sent", (data) => {
    console.log(data);
    io.emit("DM_Received", data);
  });

  // chat room message real-time updates
  socket.on("Message_Sent", (data) => {
    console.log(data);
    io.emit("Message_Received", data);
  });

  socket.on("disconnect", (data) => {
    console.log("user disconnected");
  });
});

app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
