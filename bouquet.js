const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

/* ===============================
   BALLOON SYSTEM
   =============================== */

const BALLOON_COUNT = 26;
const balloons = [];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function createBalloon(y = canvas.height + rand(50, 300)) {
  const size = rand(14, 34);
  return {
    x: rand(canvas.width * 0.2, canvas.width * 0.8),
    y,
    r: size,
    speed: rand(0.3, 0.8),
    drift: rand(0.3, 1),
    phase: Math.random() * Math.PI * 2,
    hue: rand(330, 20 + 360), // pink → red range
    opacity: rand(0.5, 0.9)
  };
}

// init
for (let i = 0; i < BALLOON_COUNT; i++) {
  balloons.push(createBalloon(rand(0, canvas.height)));
}

let t = 0;

function drawBalloon(b) {
  // horizontal drift
  const dx = Math.sin(t * b.drift + b.phase) * 20;

  const x = b.x + dx;
  const y = b.y;

  // string
  ctx.strokeStyle = `rgba(200,200,200,0.25)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + b.r);
  ctx.lineTo(x + dx * 0.2, y + b.r + b.r * 2.2);
  ctx.stroke();

  // balloon body
  ctx.fillStyle = `hsla(${b.hue}, 70%, 60%, ${b.opacity})`;
  ctx.beginPath();
  ctx.ellipse(x, y, b.r * 0.85, b.r, 0, 0, Math.PI * 2);
  ctx.fill();

  // highlight (small dot)
  ctx.fillStyle = `rgba(255,255,255,0.45)`;
  ctx.beginPath();
  ctx.arc(
    x - b.r * 0.25,
    y - b.r * 0.35,
    b.r * 0.18,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  balloons.forEach(b => {
    b.y -= b.speed;
    drawBalloon(b);

    // recycle when off-screen
    if (b.y + b.r < -50) {
      Object.assign(b, createBalloon());
    }
  });

  t += 0.01;
  requestAnimationFrame(animate);
}

animate();
