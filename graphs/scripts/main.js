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
        this.selectedNode = null;
        this.dragging = false;

        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        canvas.addEventListener("click", this.handleClick.bind(this));

    }



    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Iterate over nodes and check if the mouse click is inside any node
        for (const [nodeId, node] of this.nodes) {
            const distance = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
            if (distance <= 20) { // Assuming node radius is 20
                this.selectedNode = node;
                this.dragging = true;
                break;
            }
        }
    }

    // Event handler for mouse move event
    handleMouseMove(event) {
        if (this.dragging && this.selectedNode) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Update the position of the selected node
            this.selectedNode.x = mouseX;
            this.selectedNode.y = mouseY;

            // Redraw the graph
            this.draw();
        }
    }

    // Event handler for mouse up event
    handleMouseUp(event) {
        this.dragging = false;
        this.selectedNode = null;
    }

    handleClick(event) {
        this.addNewNode(event)
        this.draw();
    }

    useCanvasById(id) {
        this.canvas = document.getElementById(id);
        this.ctx = canvas.getContext("2d")
    }

    addNewNode(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const text = prompt("Enter text for the node:");
        if (text !== null) { // Check if user didn't cancel prompt
            const nodeId = generateUniqueId();
            const newNode = new Node(nodeId, mouseX, mouseY, text);
            this.nodes.set(nodeId, newNode);
            this.draw(); // Redraw the graph
        }

    }

    checkConnectionsBetweenNodes() {
        const nodeArray = Array.from(this.nodes.values());
        for (let i = 0; i < nodeArray.length; i++) {
            for (let j = i + 1; j < nodeArray.length; j++) {
                // Split the text into words
                const words1 = nodeArray[i].text.split(/\s+/);
                const words2 = nodeArray[j].text.split(/\s+/);
    
                // Check if any word from the first node matches any word from the second node
                if (this.hasCommonWord(words1, words2)) {
                    nodeArray[i].connections.add(nodeArray[j].id);
                    nodeArray[j].connections.add(nodeArray[i].id);
                }
            }
        }
    }
    
    // Helper function to check if any word from the first array matches any word from the second array
    hasCommonWord(words1, words2) {
        return words1.some(word1 => words2.includes(word1));
    }
    

    drawLinesBetweenNodes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const [_nodeId, node] of this.nodes) {
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
        for (const [_nodeId, node] of this.nodes) {
            const textWidth = this.ctx.measureText(node.text).width;
            const radius = Math.max(textWidth / 2 + 10, 15)
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
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
nodes.set("1", new Node("1", 100, 100, "10 Year Vision"));
nodes.set("2", new Node("2", 150, 250, "5 Year Vision"));
nodes.set("3", new Node("3", 300, 300, "1 Year Vision"));
nodes.set("4", new Node("4", 400, 400, "Python 1"));
nodes.set("5", new Node("5", 300, 450, "Golang 1"));
nodes.set("6", new Node("5", 400, 300, "Nodejs 5 1"));
let creatingNode = true; // Flag to indicate whether node creation is enabled

// Event listener for button click to toggle node creation
toggleButton.addEventListener("click", function() {
  creatingNode = !creatingNode;
});

const graph = new Graph(nodes);
graph.useCanvasById("graphCanvas")
graph.draw();

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}