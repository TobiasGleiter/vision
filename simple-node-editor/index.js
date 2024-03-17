class Node {
    constructor(x, y, text) {
      this.x = x;
      this.y = y;
      this.width = 100;
      this.height = 50;
      this.text = text;
      this.selected = false;
    }
  }
  
  let nodes = [];
  let selectedNode = null;
  
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const node of nodes) {
      ctx.fillStyle = node.selected ? 'lightblue' : 'white';
      ctx.fillRect(node.x, node.y, node.width, node.height);
      ctx.fillStyle = 'black';
      ctx.fillText(node.text, node.x + 5, node.y + 20);
    }
  }
  
  canvas.addEventListener('click', (event) => {
    console.log("click")
    const x = event.offsetX;
    const y = event.offsetY;
    for (const node of nodes) {
      if (x >= node.x && x <= node.x + node.width &&
          y >= node.y && y <= node.y + node.height) {
        selectedNode = node;
        node.selected = true;
        break;
      }
    }
    draw();
  });
  
  // Implement functions for creating new nodes, editing text, and deleting nodes
  
  draw(); // Initial draw
  