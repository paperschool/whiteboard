import { getCurvePoints } from "./utils";

class Canvas {
    constructor({ canvasId }) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio)

        this.parent = this.canvas.parentElement;
        this.size = {
            x: this.parent.offsetWidth,
            y: this.parent.offsetHeight
        }
        this.mouse = { x: 0, y: 0 }

        this.setSize(this.size);

        this.setupEvents()
        this.setupPen()

        this.penDown = false;
        this.currentLine = []
        this.userPenColour = "#fff"

        this.mouseUpHook = () => 0;

    }

    getCanvas() {
        return this.canvas;
    }

    getSize() {
        return this.size
    }

    setSize(newSize) {
        this.size = {
            x: newSize.x,
            y: newSize.y
        }
        this.canvas.width = this.size.x;
        this.canvas.height = this.size.y;
        this.canvas.style.width = this.size.x;
        this.canvas.style.height = this.size.y;
    }

    setupEvents() {
        this.canvas.addEventListener('mousemove', e => {
            // update mouse vector
            this.mouse.x = e.pageX - this.canvas.offsetLeft;
            this.mouse.y = e.pageY - this.canvas.offsetTop;

            // draw if pen is down
            if (this.penDown) {
                this.currentLine.push({
                    x: this.mouse.x,
                    y: this.mouse.y
                })
                this.continueLine({
                    point: this.mouse
                })
            }
        }, false);

        this.canvas.addEventListener('mousedown', e => {
            this.penDown = true;
            this.startLine({
                point: {
                    x: this.mouse.x,
                    y: this.mouse.y
                }, colour: this.userPenColour
            })
        }, false);

        this.canvas.addEventListener('mouseup', () => {
            this.penDown = false;
            this.mouseUpHook(this.currentLine.splice(0));
            this.currentLine = [];
        }, false);

        window.addEventListener('resize', () => {
            this.setSize({
                x: this.parent.offsetWidth,
                y: this.parent.offsetHeight
            })
        }, false);
    }

    registerMouseUpHook(callback) {
        this.mouseUpHook = callback;
    }

    setupPen() {
        this.context.lineWidth = 10;
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        this.context.strokeStyle = "#fff";
    }

    startLine({ point, colour }) {
        this.context.strokeStyle = colour;
        this.context.beginPath();
        this.context.moveTo(point.x, point.y);
    }

    continueLine({ point }) {
        this.context.lineTo(point.x, point.y);
        this.context.stroke();
    }

    drawLine({ points, colour }) {
        this.startLine({
            point: {
                x: points[0].x,
                y: points[0].y
            },
            colour
        })

        points.forEach(point => this.continueLine({ point }))

        this.context.stroke();
    }

}

export default Canvas;








