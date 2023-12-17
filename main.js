const canvas = document.getElementById("towerDefense");
const ctx = canvas.getContext("2d");
var mouseDown = false;
var mouseX = 0;
var mouseY = 0;
var deltaTime;

const stats = {

};


function mouseDownE() {
    mouseDown = true;
}

function mouseUpE() {
    mouseDown = false;
}

function updateCoordinates(e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    add(otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
    }
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    static multiply(vector, scalar) {
        return (new Vector2(vector.x * scalar, vector.y * scalar));
    }
    static add(vector1, vector2) {
        return (new Vector2(vector1.x + vector2.x, vector1.y + vector2.y));
    }
    get normalized() {
        return new Vector2(this.x / this.length, this.y / this.length);
    }
    normalize() {
        this.x = this.normalized.x;
        this.y = this.normalized.y;
    }
    toRotation() {
        let top = this.y >= 0;
        if (top) {
            return Math.acos(this.normalized.x);
        } else {
            return 2 * Math.PI - Math.acos(this.normalized.x);
        }
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }
    static subtract(vector1, vector2) {
        return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
    }
}

class Segment {
    constructor(start, end, color = "rgb(0,0,0)", width = 30) {
        this.start = start;
        this.end = end;
        this.color = color;
        this.width = width;
    }
    get length() {
        return Vector2.subtract(this.end, this.start).length;
    }
    distanceToPosition(distance) {
        const delta = Vector2.subtract(this.end, this.start);
        return Vector2.add(this.start, Vector2.multiply(delta, distance / delta.length));
    }
    draw() {
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.stroke();
    }
}

class Path {
    constructor(...segments) {
        this.segments = segments;
    }
    set width(w) {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].width = w;
        }
    }
    set color(c) {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].color = c;
        }
    }
    distanceToPosition(distance) {
        let distanceLeft = distance;
        for (let i = 0; i < this.segments.length; i++) {
            if (distanceLeft < this.segments[i].length) {
                return this.segments[i].distanceToPosition(distanceLeft);
            } else {
                distanceLeft -= this.segments[i].length;
            }
        }
        // if we get here in the loop, the distance is off the path or negative. Gotta figure that out eventually
    }
    draw() {
        for (var i = 0; i < this.segments.length; i++) {
            this.segments[i].draw();
        }
    }
}

class Zombie {
    constructor (path, speed, health, color, size) {
        this.path = path;
        this.speed = speed;
        this.health = health;
        this.distance = 0;
        this.color = color;
        this.size = size;
    }

    update () {
        this.distance += this.speed;
    }

    get position () {
        return this.path.distanceToPosition(this.distance);
    }

    draw () {
        
    }
}

var segment1 = new Segment(new Vector2(200, 0), new Vector2(200, 200));
var segment2 = new Segment(new Vector2(200, 200), new Vector2(300,300));
var testPath = new Path(segment1, segment2);
testPath.color = "rgb(255, 0, 200)";
testPath.width = 40;


function step(delta) {
    deltaTime = delta;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 255, 0)";
    if (mouseDown) ctx.fillRect(mouseX, mouseY, 10, 10);
    testPath.draw();
}

setInterval(step, 30, 30);