const { Server } = require("socket.io");
const pool = require("../db/db");

module.exports = (httpSever) => {
  const io = new Server(httpSever, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["POST", "GETA"],
      credentials: true,
    },
  });
  // connect socket io
  io.on("connection", (socket) => {
    console.log("user connect");
    console.log(socket.handshake.query.userid);
    const ownRoom = socket.handshake.query.userid;
    socket.join(ownRoom);
    // join room
    socket.on("join", (room) => {
      // console.log({ "current romm": socket.rooms });
      // get room list number
      let roomList = Array.from(socket.rooms);
      // console.log(roomList);
      // leave last room
      roomList
        .filter((item) => item !== room && item !== ownRoom)
        .forEach((item) => socket.leave(item));

      // console.log(Object.keys(socket.rooms));
      // Object.keys(socket.rooms).map((item) => console.log(item));
      console.log(`user join room ${room}`);
      socket.join(room);
    });

    // get message from client
    socket.on("message", ({ message, room }) => {
      console.log(`send message to room ${room}`);
      console.log(message);
      console.log(message.message_to);
      // send message to the room
      socket.to(room).emit("message", message, async () => {
        // new message alert/notification

        await pool.query(
          "INSERT INTO message (message_from, message_to, content) VALUES($1, $2, $3)",
          [message.message_from, message.message_to, message.content]
        );
        socket.to(message.message_to.toString()).emit("new", {
          message_from: message.message_from,
          message_to: message.message_to,
        });
      });
    });
    // disconnect
    socket.on("disconnect", () => {
      console.log("user out of connection");
    });
  });
  return io;
};
