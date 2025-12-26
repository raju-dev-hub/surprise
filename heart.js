const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let cx, cy, scale;

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  cx = canvas.width / 2;
  cy = canvas.height / 2;
  scale = Math.min(canvas.width, canvas.height) / 40;
}

addEventListener("resize", resize);
resize();

function heart(t) {
  return {
    x: 16 * Math.sin(t) ** 3,
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

const particles = [];
let time = 0;
let heartDone = false;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.life = 1;
    this.prev = [];
  }

  update() {
    this.prev.push({ x: this.x, y: this.y });
    if (this.prev.length > 10) this.prev.shift();

    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.02;
  }

  draw() {
    ctx.beginPath();
    for (let i = 0; i < this.prev.length; i++) {
      const p = this.prev[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}

function animate() {
  // IMPORTANT: keep your black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  time += 0.04;

  ctx.strokeStyle = "red";
  ctx.shadowColor = "red";
  ctx.shadowBlur = 10;
  ctx.lineWidth = 1;

  const maxT = Math.min(time, Math.PI * 2);

  for (let t = 0; t < maxT; t += 0.08) {
    const p = heart(t);
    particles.push(
      new Particle(
        cx + p.x * scale,
        cy - p.y * scale
      )
    );
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  // 🔔 SIGNAL WHEN HEART FINISHES
  if (!heartDone && time >= Math.PI * 2) {
    heartDone = true;
    window.dispatchEvent(new Event("heartDone"));
  }

  requestAnimationFrame(animate);
}

animate();
