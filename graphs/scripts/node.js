class Node {
    constructor(id, x, y, text) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.text = text;
        this.connections = new Set();
    }
}