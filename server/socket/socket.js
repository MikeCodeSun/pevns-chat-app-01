const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("user connect!");
    // join own channel
    const id = socket.handshake.query.room;
    socket.join(id);
    // join room
    socket.on("join", (room) => {
      console.log(`join room ${room}`);
      socket.join(room);
    });
    // send message to room
    socket.on("message", ({ message, room }) => {
      console.log(message);
      console.log(room);
      socket.to(room).emit("message", message);
    });
    // disconnect
    socket.on("disconnect", () => {
      console.log("use is out of connection");
    });
  });

  return io;
};
