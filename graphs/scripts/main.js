class Node {
  constructor(id, x, y, text) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.text = text;
    this.isSelected = false;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSelected(selected) {
    this.isSelected = selected;
  }
}

class Graph {
  constructor() {
    this.nodes = new Map();
    this.selectedNode = null;
    this.canvas = null;
    this.ctx = null;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
  }

  addNode(id, x, y, text) {
    const node = new Node(id, x, y, text);
    this.nodes.set(id, node);
    this.draw();
  }

  selectNode(x, y) {
    for (const [_nodeId, node] of this.nodes.entries()) {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance <= 10) {
        this.selectedNode = node;
        node.setSelected(true);
        this.draw();
        break;
      }
    }
  }

  moveSelectedNode(x, y) {
    if (this.selectedNode) {
      this.selectedNode.setPosition(x, y);
      this.draw();
    }
  }

  deleteSelectedNode() {
    if (this.selectedNode) {
      const index = this.nodes.indexOf(this.selectedNode);
      if (index !== -1) {
        this.nodes.splice(index, 1);
        this.selectedNode = null;
        this.draw();
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const [_nodeId, node] of this.nodes) {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
      this.ctx.fillStyle = node.isSelected ? "skyblue" : "steelblue";
      this.ctx.fill();
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();

      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(node.text, node.x, node.y);
    }
  }

  handleMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check for creating a new node on double click
    if (event.detail === 2) {
      this.addNode(generateUniqueId(), mouseX, mouseY, "New Node");
      this.draw();
      return;
    }

    // Check for selecting an existing node on single click
    this.selectNode(mouseX, mouseY);
  }

  handleMouseMove(event) {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

    if (this.selectedNode) {
      this.moveSelectedNode(mouseX, mouseY);
    }
  }

  handleMouseUp() {
    // Deselect node on mouse up (optional)
    this.selectedNode = null;
  }

  handleDoubleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check for deleting a selected node (optional)
    if (this.selectedNode) {
      this.deleteSelectedNode();
      return;
    }

    // Handle single click events if needed (e.g., editing node text)
  }
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

const canvas = document.getElementById("graphCanvas");
const graph = new Graph();

graph.setCanvas(canvas);

graph.addNode(generateUniqueId(), 50, 50, "Node 1");
graph.addNode(generateUniqueId(), 50, 100, "Node 2");
console.log(graph.nodes);

graph.draw();
