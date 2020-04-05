import Canvas from "./canvas"
import environmentProvider from "../environmentProvider";

class Whiteboard {
    constructor({ socket }) {

        this.socket = socket;

        const { whiteBoardId } = environmentProvider()

        this.canvas = new Canvas({
            canvasId: whiteBoardId
        });

        this.lines = []

        this.setupEvents()
    }

    setupEvents() {
        this.canvas.registerMouseUpHook(line => {
            this.addLine(line.splice(0))
            this.socket.emit("newLine", this.lines[this.lines.length - 1])
        })

        this.socket.on("clientSetup", clientConfig => {
            this.canvas.userPenColour = clientConfig.colour;
        })

        this.socket.on("refreshBoard", boardState => {
            console.log("Board Refreshing with", boardState)

            for (let userId in boardState.users) {
                const user = boardState.users[userId];

                user.lines.forEach(line => this.canvas.drawLine({
                    points: line,
                    colour: user.colour
                }))
            }
        })

        this.socket.on("newLine", newLine => {
            this.addLine(newLine);
            console.log(newLine)
            this.canvas.drawLine({ points: newLine.line, colour: newLine.colour })
        })

    }

    addLine(line) {
        this.lines.push(line);
    }

}

export default Whiteboard;