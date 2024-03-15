const Node = require('./node');

class Graph {
    constructor(nodes) {
        this.nodes = nodes;
    }

    useCanvasById(id) {
        this.canvas = document.getElementById(id);
        this.ctx = canvas.getContext("2d")
    }

    addNewNode() {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const text = prompt("Enter text for the node:"); // Prompt user for text input
        const nodeId = generateUniqueId();

        const newNode = new Node(nodeId, mouseX, mouseY, text);

        this.nodes.set(nodeId, newNode);
    }

    checkConnectionsBetweenNodes() {
        const nodeArray = Array.from(this.nodes.values());
        for (let i = 0; i < nodeArray.length; i++) {
            for (let j = i + 1; j < nodeArray.length; j++) {
                if (nodeArray[i].text === nodeArray[j].text) {
                    nodeArray[i].connections.add(nodeArray[j].id);
                    nodeArray[j].connections.add(nodeArray[i].id);
                }
            }
        }
    }

    drawLinesBetweenNodes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const [nodeId, node] of this.nodes) {
            node.connections.forEach(connectionId => {
                const targetNode = this.nodes.get(connectionId);
                this.ctx.beginPath();
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(targetNode.x, targetNode.y);
                this.ctx.strokeStyle = "black";
                this.ctx.stroke();
            });
        }
    }

    drawNodes() {
        for (const [nodeId, node] of this.nodes) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            this.ctx.fillStyle = "steelblue";
            this.ctx.fill();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();

            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(node.text, node.x, node.y);
        }
    }
    

    draw() {
        this.checkConnectionsBetweenNodes();
        this.drawLinesBetweenNodes();
        this.drawNodes()
    }
}

module.exports = Graph;