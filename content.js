if (typeof isDrawingInitialized === 'undefined') {
    let isDrawingInitialized = true;
    let isDrawing = false;
    let canvas, ctx;
  
    function createCanvas() {
      canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '9999';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
    }
  
    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }
  
    function stopDrawing() {
      isDrawing = false;
      ctx.beginPath();
    }
  
    function draw(e) {
      if (!isDrawing) return;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'red';
      
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
  
    function initializeDrawing() {
      if (!canvas) {
        createCanvas();
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
      }
    }
  
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggleDrawing') {
        if (!canvas) {
          initializeDrawing();
        } else {
          canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
        }
        sendResponse({status: "Drawing toggled"});
      }
      return true;  // Indicates that the response is sent asynchronously
    });
  }