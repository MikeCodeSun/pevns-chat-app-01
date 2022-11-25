import { io } from "socket.io-client";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

const cookie = Cookies.get("token");
let decoded;
if (cookie) {
  decoded = jwt_decode(cookie);
}

class IoServer {
  socket;
  constructor() {}
  connectIo() {
    this.socket = io("http://localhost:4000", {
      query: { userid: decoded?.id },
    });
  }
  joinRoom(room) {
    // console.log(`user join room ${room}`);
    this.socket.emit("join", room);
  }
  sendMessage({ room, message }, cb) {
    this.socket.emit("message", { room, message });
    cb();
  }
  // send message get message 1119
  getMessage(cb) {
    this.socket.on("message", (message) => {
      console.log(message);
      cb(message);
    });
  }
  // get new message alert
  getNewMessageAlert(cb) {
    // console.log("alert io");
    this.socket.on("new", (data) => {
      // console.log("alert on");
      // console.log(data);
      cb(data);
    });
  }
  // disconnect
  disconnect() {
    this.socket.disconnect();
  }
}

export default new IoServer();
