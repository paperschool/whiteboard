class Canvas {
    constructor({ canvasId }) {

        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.context.translate(0.5, 0.5)
        this.scale = 2;
        this.context.scale(
            window.devicePixelRatio * this.scale,
            window.devicePixelRatio * this.scale
        );

        this.parent = this.canvas.parentElement;
        this.size = {
            x: this.parent.offsetWidth,
            y: this.parent.offsetHeight
        }
        this.mouse = { x: 0, y: 0 }

        this.penDown = false;
        this.currentLine = []
        this.userPenColour = "#fff"

        this.isResizing = false;
        this.resizeDebounceTime = 500;

        this.setSize(this.size);
        this.setupEvents()
        this.setupPen()
        this.mouseUpHook = () => 0;
        this.resizeHook = () => 0;

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
        console.log(this.size, newSize)
        this.size = {
            x: newSize.x,
            y: newSize.y
        }
        this.canvas.width = this.size.x * this.scale;
        this.canvas.height = this.size.y * this.scale;
        this.canvas.style.width = this.size.x + "px";
        this.canvas.style.height = this.size.y + "px";
    }

    eventNormaliser(e) {
        if (e.constructor.name === "TouchEvent") {
            return {
                x: e.touches[0].clientX * this.scale,
                y: e.touches[0].clientY * this.scale
            }
        } else {
            return {
                x: e.clientX * this.scale,
                y: e.clientY * this.scale
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

        this.canvas.addEventListener('mousedown', this.penDownEventHandler.bind(this), false);
        this.canvas.addEventListener("touchstart", this.penDownEventHandler.bind(this), false)

        this.canvas.addEventListener('mousemove', this.penMoveEventHandler.bind(this), false);
        this.canvas.addEventListener('touchmove', this.penMoveEventHandler.bind(this), false);

        this.canvas.addEventListener('mouseup', this.penUpEventHandler.bind(this), false);
        this.canvas.addEventListener('touchend', this.penUpEventHandler.bind(this), false);

        window.addEventListener('resize', e => {

            clearTimeout(this.resizeDebounce);

            this.resizeDebounce = setTimeout(() => {
                this.setSize({
                    x: this.parent.offsetWidth,
                    y: this.parent.offsetHeight
                })
                this.resizeHook(e)
            }, this.resizeDebounceTime)

        }, false);
    }

    registerMouseUpHook(callback) {
        this.mouseUpHook = callback;
    }

    registerResizeHook(callback) {
        this.resizeHook = callback
    }

    setupPen() {
        this.context.lineWidth = 5;
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








