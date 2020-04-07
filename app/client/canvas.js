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

        this.penDown = false;
        this.currentLine = []
        this.userPenColour = "#fff"

        this.setSize(this.size);
        this.setupEvents()
        this.setupPen()
        this.mouseUpHook = () => 0;

    }

    setMouse(location) {
        this.mouse = {
            ...location
        }
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

    eventNormaliser(e) {
        if (e.constructor.name === "TouchEvent") {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }
        } else {
            return {
                x: e.clientX,
                y: e.clientY
            }
        }
    }

    penDownEventHandler(e) {

        // update mouse vector
        this.setMouse(this.eventNormaliser(e))
        this.penDown = true;

        this.startLine({
            point: {
                x: this.mouse.x,
                y: this.mouse.y
            }, colour: this.userPenColour
        })
    }

    penMoveEventHandler(e) {

        // update mouse vector
        this.setMouse(this.eventNormaliser(e))

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
    }

    penUpEventHandler(e) {
        this.penDown = false;
        this.mouseUpHook(this.currentLine.splice(0));
        this.currentLine = [];
    }

    setupEvents() {

        // 
        this.canvas.addEventListener('mousedown', this.penDownEventHandler.bind(this), false);
        this.canvas.addEventListener("touchstart", this.penDownEventHandler.bind(this), false)

        this.canvas.addEventListener('mousemove', this.penMoveEventHandler.bind(this), false);
        this.canvas.addEventListener('touchmove', this.penMoveEventHandler.bind(this), false);

        this.canvas.addEventListener('mouseup', this.penUpEventHandler.bind(this), false);
        this.canvas.addEventListener('touchend', this.penUpEventHandler.bind(this), false);

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

    clear() {
        this.context.clearRect(0, 0, this.size.x, this.size.y);
    }
}

export default Canvas;








