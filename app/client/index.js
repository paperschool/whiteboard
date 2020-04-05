
import io from "socket.io-client";
import Whiteboard from "./whiteboard";

const socketConnection = io.connect();

const whiteboard = new Whiteboard({ socket: socketConnection });
