
const canvas = document.getElementById('rnnCanvas');
const ctx = canvas.getContext('2d');
const N = 50, R = 300, K = 3;
const centerX = canvas.width / 2, centerY = canvas.height / 2;
const dt = 0.1, tau = 30, g = 10;
const std = g / Math.sqrt(N);

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < N; i++) {
    let [x, y] = positions[i];
    let activity = Math.tanh(Math.abs(r[i]));
    let color = `hsl(${60 + 120 * (1 - activity)}, 100%, ${30 + 50 * activity}%)`;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
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
      ctx.strokeStyle = J[i][j] > 0 ? 'red' : 'blue';
      ctx.lineWidth = Math.abs(J[i][j]) * 2;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  }
}

function loop() {
  step();
  draw();
  requestAnimationFrame(loop);
}

loop();
