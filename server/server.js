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

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("Viewed_Home", (data) => {
    console.log(data);
  });

  // Define your Socket.IO logic here
  socket.on("custom-event", (data) => {
    console.log("Received custom event: " + data);
    // You can broadcast this data to other connected clients if needed
    io.emit("custom-event", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
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

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3001;
// app.use(cors());
// app.use(express.json());

// const UserRouter = require("./routes/UsersAPI");
// const RoomRouter = require("./routes/RoomsAPI");

// app.use("/users", UserRouter);
// app.use("/rooms", RoomRouter);

// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("MongoDB database connection established successfully");
// });

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

// app.use(
//   cors({
//     origin: ["http://localhost:4200"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
