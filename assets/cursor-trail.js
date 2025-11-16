// === Minimal, Silky-Smooth Cursor Trail Matching Accent Color ===
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth, height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  let points = [];
  const maxPoints = 12; // SHORT, crisp tail
  const widthStart = 5;
  const widthEnd = 1.3;
  const fadeSpeed = 0.095;

  // Get accent color from CSS variable --accent
  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#37f0f9';
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function drawTrail() {
    ctx.clearRect(0, 0, width, height);
    if(points.length < 2) return;
    for(let i=0; i<points.length-1; i++){
      const t = i / (points.length-1);
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i+1].x, points[i+1].y);
      ctx.strokeStyle = getAccent();
      ctx.globalAlpha = lerp(0.8, 0, t); // Fades out smoothly
      ctx.lineWidth = lerp(widthStart, widthEnd, t);
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function animate() {
    // Fade tail naturally if no new points are added
    if(points.length > 1) {
      for(let i=0; i<points.length; i++){
        points[i].life = (points[i].life || 1) - fadeSpeed;
      }
      // Remove old points
      points = points.filter(p => p.life > 0);
    }
    drawTrail();
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('mousemove', function(e) {
    points.push({x: e.clientX, y: e.clientY, life: 1});
    if(points.length > maxPoints) points.shift();
  });

  window.addEventListener('resize', function(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 9999;
})();
