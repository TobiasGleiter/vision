class Node {
    constructor(id, x, y, text) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.text = text;
        this.connections = new Set();
    }
}

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


const canvas = document.getElementById("graphCanvas");
const toggleButton = document.getElementById("toggleButton");

let nodes = new Map(); // Map to store nodes and their connections
nodes.set("1", new Node("1", 100, 100, "apple"));
nodes.set("2", new Node("2", 150, 250, "banana"));
nodes.set("3", new Node("3", 300, 300, "apple"));
nodes.set("4", new Node("4", 400, 400, "orange"));
let creatingNode = false; // Flag to indicate whether node creation is enabled

// Event listener for button click to toggle node creation
toggleButton.addEventListener("click", function() {
  creatingNode = !creatingNode;
});

const graph = new Graph(nodes);
graph.useCanvasById("graphCanvas")
graph.draw();

// Event listener for mouse click to add a new node
canvas.addEventListener("click", function(event) {
  if (creatingNode) {

    graph.addNewNode()
    graph.draw();
    console.log(graph.nodes)
  }
});

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}