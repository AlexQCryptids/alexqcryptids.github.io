// High-DPI Canvas Setup Function
function setupCanvas(id, cssSize = 800) {
  const canvas = document.getElementById(id);
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = cssSize + "px";
  canvas.style.height = cssSize + "px";
  canvas.width = cssSize * dpr;
  canvas.height = cssSize * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { ctx, cssSize };
}

// Setup
const { ctx, cssSize } = setupCanvas("rnnCanvas", 420);
const N = 100, R = 150, K = 7;
const centerX = cssSize / 2, centerY = cssSize / 2;
const dt = 0.2, tau = 30, g = 10;
const std = g / Math.sqrt(N);

// RNN Model
let J = Array.from({length: N}, () => Array.from({length: N}, () => std * (Math.random() * 2 - 1)));
let r = Array.from({length: N}, () => Math.random() * 2 - 1);

let positions = Array.from({length: N}, (_, i) => [
  centerX + R * Math.cos(2 * Math.PI * i / N),
  centerY + R * Math.sin(2 * Math.PI * i / N)
]);

function f(x) {
  return Math.tanh(x);
}

function step() {
  let newR = r.map((_, i) => {
    let input = J[i].reduce((sum, J_ij, j) => sum + J_ij * f(r[j]), 0);
    return r[i] + (dt / tau) * (-r[i] + input);
  });
  r = newR;
}

function draw() {
  ctx.clearRect(0, 0, cssSize, cssSize);

  
  // Caption below
  ctx.fillStyle = "white";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("A recurrent neural network with all-to-all connection.", cssSize / 2, cssSize - 30);
  ctx.fillText("Brightness representing neural acitivity. Purple: Excitatory. Cyan: Inhibitory ", cssSize / 2, cssSize -16);
  ctx.font = "italic 10px sans-serif";
  ctx.fillText("Haim Sompolinsky et al. Chaos in Random Neural Networks. Physical Review Letters (1988)", cssSize / 2, cssSize-2 );
  for (let i = 0; i < N; i++) {
    let [x, y] = positions[i];
    //let activity = Math.tanh(r[i]);
    let activity = r[i];

    let hue = activity >= 0 ? 180 : 300;
    let lightness = 0 + 5*  Math.abs(activity);
    let color = `hsl(${hue}, 100%, ${lightness}%)`;
    
    //let color = `hsl(${60 + 120 * (1 - activity)}, 100%, ${30 + 50 * activity}%)`;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
  for (let i = 0; i < N; i++) {
    let sortedIndices = Array.from({length: N}, (_, j) => j)
      .filter(j => j !== i)
      .sort((a, b) => Math.abs(J[i][b]) - Math.abs(J[i][a]))
      .slice(0, K);
    for (let j of sortedIndices) {
      let [x1, y1] = positions[i];
      let [x2, y2] = positions[j];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = J[i][j] > 0 ? '#b48ffa'  : '#b48ffa' ;
      ctx.lineWidth = Math.abs(J[i][j]) * 0.3;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  }
}

function loop() {
  step();
  step();
  step();
  step();
  step();
  draw();
  requestAnimationFrame(loop);
}

loop();

