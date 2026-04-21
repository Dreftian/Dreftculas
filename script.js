const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
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

  // Adjust particle count based on screen size for performance
  if (width < 576) {
    COUNT = 8000;
  } else if (width < 992) {
    COUNT = 10000;
  } else {
    COUNT = 14000;
  }

  if (!particles.length) {
    initParticles();
  } else {
    // Sync particle size if needed
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

function initParticles() {
  const pSizeBase = width < 576 ? 1.8 : 1.35;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: cx + rand(-180, 180),
      y: cy + rand(-180, 180),
      tx: cx,
      ty: cy,
      vx: 0,
      vy: 0,
      size: Math.random() * pSizeBase + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      jitter: Math.random() * Math.PI * 2,
    });
  }
  setSphereTargets();
}

function spherePoint(radius = Math.min(width, height) * 0.14) {
  const u = Math.random() * 2 - 1;
  const theta = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  const x3 = r * Math.cos(theta);
  const y3 = r * Math.sin(theta);
  const z3 = u;
  const perspective = 0.68 + (z3 + 1) * 0.36;
  return {
    x: cx + x3 * radius * perspective,
    y: cy + y3 * radius * perspective,
  };
}

function setSphereTargets() {
  targetMode = "sphere";
  currentText = "";
  for (const p of particles) {
    const t = spherePoint();
    p.tx = t.x;
    p.ty = t.y;
  }
}

function wrapText(ctx2d, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let line = "";

  function splitLongWord(word) {
    const chunks = [];
    let current = "";

    for (const char of word) {
      const test = current + char;
      if (current && ctx2d.measureText(test).width > maxWidth) {
        chunks.push(current);
        current = char;
      } else {
        current = test;
      }
    }

    if (current) chunks.push(current);
    return chunks;
  }

  for (const word of words) {
    const parts = ctx2d.measureText(word).width > maxWidth ? splitLongWord(word) : [word];

    for (const part of parts) {
      const test = line ? line + " " + part : part;
      if (!line || ctx2d.measureText(test).width <= maxWidth) {
        line = test;
      } else {
        lines.push(line);
        line = part;
      }
    }
  }

  if (line) lines.push(line);
  return lines;
}

function samplePointsEvenly(points, desiredCount) {
  if (!points.length) return [];
  if (points.length <= desiredCount) return points.slice();

  const sampled = [];
  const lastIndex = points.length - 1;
  for (let i = 0; i < desiredCount; i++) {
    const ratio = desiredCount === 1 ? 0 : i / (desiredCount - 1);
    sampled.push(points[Math.floor(ratio * lastIndex)]);
  }
  return sampled;
}

function setTextTargets(text) {
  const clean = text.trim();
  if (!clean) {
    setSphereTargets();
    return;
  }

  currentText = clean;
  targetMode = "text";

  const off = document.createElement("canvas");
  const octx = off.getContext("2d");

  // Use a fixed resolution for the offscreen canvas that matches the viewport aspect ratio
  const scale = 2.0; 
  const w = Math.floor(width * scale);
  const h = Math.floor(height * scale);
  off.width = w;
  off.height = h;

  octx.clearRect(0, 0, w, h);
  octx.fillStyle = "white";
  octx.textAlign = "center";
  octx.textBaseline = "middle";

  const exactText = clean;
  const isLandscape = width > height;
  
  // Dynamic line target based on text length and orientation
  const targetLines = 
    exactText.length > (isLandscape ? 120 : 80) ? 5 :
    exactText.length > (isLandscape ? 80 : 44) ? 4 :
    exactText.length > (isLandscape ? 40 : 18) ? 3 :
    exactText.length > 12 ? 2 : 1;

  const padding = w * 0.1;
  const maxTextWidth = w - padding * 2;
  // Account for UI at the bottom (approx 120px on screen -> 120 * scale in offscreen)
  const uiHeight = (width < 576 ? 140 : 80) * scale;
  const maxTextHeight = h - uiHeight - padding;

  let fontSize = (w / (targetLines * 2.5)) * scale;
  if (isLandscape) fontSize = Math.min(fontSize, (h / (targetLines * 1.5)) * scale);
  
  let lines = [];

  // Find the perfect font size
  while (fontSize >= 10 * scale) {
    octx.font = `900 ${fontSize}px Inter, Arial, sans-serif`;
    lines = wrapText(octx, exactText, maxTextWidth);

    const lineHeight = fontSize * 1.15;
    const totalHeight = lines.length * lineHeight;
    const widest = lines.reduce((max, line) => Math.max(max, octx.measureText(line).width), 0);

    if (totalHeight <= maxTextHeight && widest <= maxTextWidth) {
      break;
    }

    fontSize -= 1 * scale;
  }

  octx.clearRect(0, 0, w, h);
  octx.fillStyle = "white";
  octx.font = `900 ${fontSize}px Inter, Arial, sans-serif`;
  octx.textAlign = "center";
  octx.textBaseline = "middle";

  const lineHeight = fontSize * 1.15;
  const totalTextHeight = lines.length * lineHeight;
  // Center vertically in the "safe area" (above UI)
  const safeCenterY = (h - uiHeight) / 2;
  const startY = safeCenterY - totalTextHeight / 2 + lineHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    octx.fillText(lines[i], w / 2, startY + i * lineHeight);
  }

  const image = octx.getImageData(0, 0, w, h).data;
  const rawPoints = [];
  // Adjust step based on font size to keep density consistent
  const step = Math.max(2, Math.floor(fontSize / (20 * scale)));

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const alpha = image[(y * w + x) * 4 + 3];
      if (alpha > 120) {
        rawPoints.push({
          x: x / scale,
          y: y / scale,
        });
      }
    }
  }

  if (!rawPoints.length) {
    setSphereTargets();
    return;
  }

  const sampledPoints = samplePointsEvenly(rawPoints, particles.length);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const t = sampledPoints[i % sampledPoints.length];
    p.tx = t.x + rand(-0.35, 0.35);
    p.ty = t.y + rand(-0.35, 0.35);
  }
}

function animate() {
  time += 0.016;
  ctx.clearRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.min(width, height) * 0.22);
  glow.addColorStop(0, "rgba(0, 229, 255, 0.16)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    const flutter = targetMode === "sphere" ? 0.85 : 0.16;

    p.vx += dx * 0.011;
    p.vy += dy * 0.011;
    p.vx *= 0.9;
    p.vy *= 0.9;
    p.x += p.vx + Math.cos(time * 2 + p.jitter) * 0.08 * flutter;
    p.y += p.vy + Math.sin(time * 2.4 + p.jitter) * 0.08 * flutter;

    const a = 0.56 + Math.sin(time * 2 + p.jitter) * 0.18 + p.alpha * 0.28;
    ctx.beginPath();
    ctx.fillStyle = `rgba(0, 255, 255, ${Math.max(0.08, a)})`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

function applyText() {
  const value = input.value;
  if (value.trim()) {
    setTextTargets(value);
  } else {
    setSphereTargets();
  }
}

function runLayoutTests() {
  const testCanvas = document.createElement("canvas");
  const testCtx = testCanvas.getContext("2d");
  testCtx.font = "900 48px Inter, Arial, sans-serif";

  const tests = [
    {
      name: "wrapText splits long sentence",
      run: () => {
        const lines = wrapText(testCtx, "Te amo mucho Damiaris", 280);
        return lines.length >= 2;
      },
    },
    {
      name: "wrapText preserves case and punctuation",
      run: () => {
        const lines = wrapText(testCtx, "Darmaris, te amo siempre.", 220);
        return lines.join(" ").includes("Darmaris,") && lines.join(" ").includes("siempre.");
      },
    },
    {
      name: "samplePointsEvenly keeps full width coverage",
      run: () => {
        const points = Array.from({ length: 1000 }, (_, i) => ({ x: i, y: 0 }));
        const sampled = samplePointsEvenly(points, 100);
        return sampled[0].x === 0 && sampled[sampled.length - 1].x >= 999;
      },
    },
  ];

  tests.forEach((test) => {
    const passed = test.run();
    console.assert(passed, `Test failed: ${test.name}`);
  });
}

button.addEventListener("click", applyText);

input.addEventListener("input", () => {
  if (!input.value.trim()) {
    setSphereTargets();
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyText();
  }
  if (e.key === "Escape") {
    input.value = "";
    setSphereTargets();
  }
});

window.addEventListener("resize", resize);

resize();
runLayoutTests();
animate();
