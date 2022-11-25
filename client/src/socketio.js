import { io } from "socket.io-client";

class SocketioSevice {
  socket;
  constructor() {}
  // set up socketio connect to server
  sutupSoketConnection(id) {
    console.log("user connect");
    this.socket = io("http://localhost:4000", {
      query: { room: id },
    });
  }
  // join room
  joinMessage(room) {
    this.socket.emit("join", room);
  }
  // send message
  sendMessage({ message, room }, cb) {
    this.socket.emit("message", { message, room });
    cb();
  }
  // receive message
  getMessage(cb) {
    this.socket.on("message", (message) => {
      console.log(message);
      return cb(null, message);
    });
  }
  // disconnect
  disconnectSocketConnection() {
    console.log("user out of connection");
    this.socket.disconnect();
  }
}

export default new SocketioSevice();
