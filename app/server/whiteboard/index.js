import sockets from "socket.io";
import {
    connectedClientData,
    connectedClientSockets,
    addClient,
    getClientData,
    addLineToClient
} from "./state";


const whiteboard = httpServer => {

    const io = sockets(httpServer, { serveClient: false });

    io.on('connection', client => {
        console.log(`Client ${client.id} Established!`)

        addClient(client);

        // sending client setup details
        client.emit("clientSetup", getClientData(client.id));

        // sending board state
        client.emit("refreshBoard", connectedClientData);

        // client requesting state
        client.on("requestRefresh", () => {
            client.emit("refreshBoard", connectedClientData);
        })

        // on client new line update
        client.on("newLine", newLinePoints => {
            console.log(`Line From - ${client.id} with ${newLinePoints.length} Points`);

            if (typeof newLinePoints !== "object" || newLinePoints.length <= 0) {
                console.log(`Client ${client.id} Sending Poor Data.`)
                return
            }

            // store new line data in state
            addLineToClient({ clientId: client.id, lineData: newLinePoints })

            // construct new line response
            const newLine = {
                line: newLinePoints,
                colour: getClientData(client.id).colour
            }

            connectedClientSockets.forEach(connectedClient => {
                if (client.id !== connectedClient.id) {
                    console.log(`Pushing: ${newLine.line.length} | ${newLine.colour} to ${connectedClient.id} `)
                    connectedClient.emit("newLine", newLine);
                }
            })
        })


    });

}

export default whiteboard;