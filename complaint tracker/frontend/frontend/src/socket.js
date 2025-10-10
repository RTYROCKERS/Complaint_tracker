import { io } from "socket.io-client";
const API=`${process.env.REACT_APP_BACKEND}`;
const socket = io(`${API}`, {
  transports: ["websocket"], // faster connection
});

export default socket;
