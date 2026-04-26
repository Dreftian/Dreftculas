const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d", { alpha: false }); // Optimization
const input = document.getElementById("textInput");
const button = document.getElementById("morphBtn");

let width = 0;
let height = 0;
let cx = 0;
let cy = 0;
let time = 0;
let currentText = "";

let COUNT = 14000;
const particles = [];
let targetMode = "sphere";

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  cx = width / 2;
    cy = height / 2 - (width < 576 ? 40 : 24);

  // Responsive particle count
  if (width < 576) {
        COUNT = 8000;
  } else if (width < 992) {
        COUNT = 10000;
  } else {
        COUNT = 14000;
  }

  if (particles.length === 0) {
        initParticles();
  } else {
        // Sync particle properties if count or size needs update
      const pSizeBase = width < 576 ? 1.8 : 1.35;
        for (const p of particles) {
                p.size = Math.random() * pSizeBase + 0.4;
        }

      if (currentText.trim()) {
              setTextTargets(currentText);
      } else {
              setSphereTargets();
      }
  }
}
class Particle {
    constructor() {
          this.x = rand(0, width);
          this.y = rand(0, height);
          this.tx = this.x;
          this.ty = this.y;
          this.vx = 0;
          this.vy = 0;
          this.friction = rand(0.85, 0.92);
          this.spring = rand(0.04, 0.08);
          this.size = 1.5;
          this.color = `rgba(255, 255, 255, ${rand(0.3, 0.8)})`;
    }

  update() {
        this.vx += (this.tx - this.x) * this.spring;
        this.vy += (this.ty - this.y) * this.spring;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
  }

  draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function initParticles() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
          particles.push(new Particle());
    }
    setSphereTargets();
}

function setSphereTargets() {
    targetMode = "sphere";
    const radius = Math.min(width, height) * 0.35;
    for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);

      // Orthographic projection of a sphere
      p.tx = cx + radius * Math.sin(phi) * Math.cos(theta);
          p.ty = cy + radius * Math.sin(phi) * Math.sin(theta) * 0.5; // Flattened
    }
}
function setTextTargets(text) {
    targetMode = "text";
    currentText = text;

  const fontSize = Math.min(width * 0.15, 180);
    ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

  // Measure text and handle wrapping if needed (simplified)
  const metrics = ctx.measureText(text);
    const textWidth = metrics.width;

  // For multi-line or long text, we'd need more logic
  // For now, let's just use the single line

  ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillText(text, cx, cy);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const pixels = [];
    const step = 4; // Sampling density
  const dpr = window.devicePixelRatio || 1;

  for (let y = 0; y < canvas.height; y += step * dpr) {
        for (let x = 0; x < canvas.width; x += step * dpr) {
                const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
                if (imageData[index + 3] > 128) {
                          pixels.push({ x: x / dpr, y: y / dpr });
                }
        }
  }

  if (pixels.length === 0) return;

  for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const target = pixels[i % pixels.length];
        p.tx = target.x + rand(-2, 2);
        p.ty = target.y + rand(-2, 2);
  }
}

function loop() {
    time += 0.01;

  // Fill background (opaque for optimization if possible)
  ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);

  // Subtle glow effect (costly, use sparingly)
  // ctx.shadowBlur = 4;
  // ctx.shadowColor = "white";

  for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw();
  }

  requestAnimationFrame(loop);
}

// Interactivity
button.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
          setTextTargets(text);
    } else {
          setSphereTargets();
    }
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
          button.click();
    }
});

window.addEventListener("resize", resize);

// Start
resize();
loop();
