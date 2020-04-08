import sockets from "socket.io";
import { randomInt, randomHex } from "../utilities";
import {
    connectedClientSockets,
    addClient,
    addBotClient,
    addLineToClient,
    getClientData,
    getSanitisedClientData,
    resetData
} from "./state";

export const clearWhiteboard = () => {
    console.log("Client Reset Board")
    resetData()
    connectedClientSockets.forEach(
        client => client.emit("clearBoard")
    )
};

const broadcast = (callback, clientResponsible) => {
    connectedClientSockets.forEach(connectedClient => {
        if (clientResponsible && clientResponsible.id === connectedClient.id) {
            return connectedClient
        }
        callback(connectedClient)
    })
}

const simulateUsers = () => {
    console.log("Starting Simulation")

    addBotClient({
        name: "Dominics Only Friend <3"
    })

    setInterval(() => {

        console.log("Broadcasting New Random Line")

        const newLine = new Array(randomInt({ min: 5, max: 100 }))
            .fill({
                x: randomInt({ min: 10, max: 500 }),
                y: randomInt({ min: 10, max: 500 })
            })
            .map((point, index, points) => {
                if (index !== 0) {
                    return ({
                        x: randomInt({ min: 10, max: 500 }),
                        y: randomInt({ min: 10, max: 500 })
                    })
                }
                return point
            })


        broadcast(connectedClient => {
            connectedClient.emit("newLine", ({
                line: newLine,
                colour: randomHex()
            }))
        })

    }, 1000)
}

const whiteboard = httpServer => {

    // simulateUsers()

    const io = sockets(httpServer, { serveClient: false });

    io.on('connection', client => {

        addClient(client);

        // sending client setup details
        client.emit("clientSetup", getClientData(client));

        // sending board state
        client.emit("refreshBoard", getSanitisedClientData());

        // client requesting state
        client.on("requestRefresh", () => {
            client.emit("refreshBoard", getSanitisedClientData());
        })


        // on client new line update
        client.on("newLine", line => {
            console.log(`Line From - ${client.id} with ${line.length} Points`);

            // store new line data in state
            // and exit early if line was malformed
            if (!addLineToClient({ client, lineData: line })) {
                return;
            }

            // construct new line response
            const newLine = {
                line,
                colour: getClientData(client).colour
            }

            broadcast(connectedClient => {
                console.log(`Pushing: ${newLine.line.length} | ${newLine.colour} to ${connectedClient.id} `)
                connectedClient.emit("newLine", newLine);
            }, client);

        })

    });

}

export default whiteboard;