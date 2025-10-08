import { io } from "socket.io-client";
const API="http://localhost:5000";
const socket = io(`${API}`, {
  transports: ["websocket"], // faster connection
});

export default socket;
