import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
});

export default socket;