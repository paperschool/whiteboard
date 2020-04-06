import Canvas from "./canvas"
import environmentProvider from "../environmentProvider";

class Whiteboard {
    constructor({ socket }) {

        this.socket = socket;

        const { whiteBoardId } = environmentProvider()

        this.canvas = new Canvas({
            canvasId: whiteBoardId
        });

        this.linesToBeDrawn = []
        this.setupEvents()
    }

    setupEvents() {
        this.canvas.registerMouseUpHook(line => {
            // emit newly drawn line
            this.socket.emit("newLine", line)

            // draw lines that came in while drawing this line
            console.log("Drawing Missing Lines - ", this.linesToBeDrawn.length)
            this.linesToBeDrawn.forEach(lineToBeDrawn => this.canvas.drawLine({
                points: lineToBeDrawn.line,
                colour: lineToBeDrawn.colour
            }))
            this.linesToBeDrawn = [];

        })


        this.socket.on("clientSetup", clientConfig => {
            this.canvas.userPenColour = clientConfig.colour;
        })

        this.socket.on("refreshBoard", boardState => {
            console.log("Board Refreshing with", boardState)

            for (let userId in boardState.users) {
                const user = boardState.users[userId];

                user.lines.forEach(line =>
                    this.canvasDrawLine({
                        line,
                        colour: user.colour
                    }))
            }
        })

        this.socket.on("newLine", newLine => {
            console.log(newLine)
            this.canvasDrawLine(newLine);

        })

        this.socket.on("clearBoard", () => {
            console.log("Board Cleared")
            this.canvas.clear()
        })

    }

    canvasDrawLine(newLine) {
        if (!this.canvas.penDown) {
            this.canvas.drawLine({
                points: newLine.line,
                colour: newLine.colour
            })
        } else {
            this.linesToBeDrawn.push(newLine);
        }
    }

}



export default Whiteboard;