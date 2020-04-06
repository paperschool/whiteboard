import path from "path";
import express from "express";
import http from "http";

// handle http routes
import routes from "./routes";

// handle socket connections
import Whiteboard from "./whiteboard";

// express server
const expressApp = express();
expressApp.use(express.static(path.join(__dirname, "../client")));
expressApp.use(routes);

// socket io requirement is to use http
const httpServer = http.Server(expressApp);
Whiteboard(httpServer)

// start server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log("Server Listening on port: ", PORT);
})
