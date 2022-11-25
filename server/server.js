const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const pool = require("./db/db");
// const getIo = require("./socket/socket");
const connectIo = require("./socket/socketio");

require("dotenv").config();

const port = process.env.PORT || 4000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const httpServer = createServer(app);
// io
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {
//   console.log("user on");
//   // console.log(socket);
//   // socket get all message from db use pool, and socket send/emit all message to client
//   socket.on("getAllMessage", (data) => {
//     pool.query(
//       "SELECT * FROM message WHERE (message_from=$1 AND message_to=$2) OR (message_from=$2 AND message_to=$1) ORDER BY created_at DESC",
//       [data.from, data.to],
//       (err, res) => {
//         if (err) throw err;
//         socket.emit("allMessage", res.rows);
//       }
//     );
//   });
//   socket.on("disconnect", () => {
//     console.log("user out");
//   });
// });

// const io = getIo(httpServer);
const io = connectIo(httpServer);
app.get("/", (req, res) => res.send("hello world!"));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

httpServer.listen(port, () => {
  pool
    .connect()
    .then(() => console.log("database on!"))
    .catch((err) => console.log(err));
  console.log(`server is running on port: ${port}`);
});
