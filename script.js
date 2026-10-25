const balloonContainer = document.getElementById('balloon-container');
const colors = ['#ff4757', '#2ed573', '#ffa502', '#70a1ff', '#ff78ae', '#eccc68'];

function createBalloons(count = 15) {
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.animationDuration = `${6 + Math.random() * 6}s`;
    balloon.style.animationDelay = `${Math.random() * 5}s`;
    balloonContainer.appendChild(balloon);
  }
}
createBalloons();


const cake = document.getElementById('cake');
const flames = [document.getElementById('flame1'), document.getElementById('flame2'), document.getElementById('flame3')];
const smokes = [document.getElementById('smoke1'), document.getElementById('smoke2'), document.getElementById('smoke3')];
let candlesBlown = false;

cake.addEventListener('click', blowOutCandles);

function blowOutCandles() {
  if (candlesBlown) return;
  candlesBlown = true;

  flames.forEach((flame, index) => {
    setTimeout(() => {
      flame.classList.add('out');
      smokes[index].classList.add('active');
    }, index * 200);
  });

  triggerConfetti();
}


const giftBox = document.getElementById('giftBox');
const wishCard = document.getElementById('wishCard');

giftBox.addEventListener('click', () => {
  giftBox.classList.add('open');
  setTimeout(() => {
    wishCard.style.display = 'block';
    triggerConfetti();
    playMelody();
  }, 400);
});


const canvas = document.getElementById('canvas-overlay');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 4;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = Math.random() * -12 - 5;
    this.gravity = 0.3;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    this.opacity = 1;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.008;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function triggerConfetti() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(centerX, centerY));
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.opacity <= 0 || p.y > canvas.height) {
      particles.splice(index, 1);
    }
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

document.getElementById('confettiBtn').addEventListener('click', triggerConfetti);


let audioCtx = null;

function playMelody() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  const notes = [
    { note: 261.63, duration: 0.4 }, 
    { note: 261.63, duration: 0.4 }, 
    { note: 293.66, duration: 0.8 }, 
    { note: 261.63, duration: 0.8 }, 
    { note: 349.23, duration: 0.8 }, 
    { note: 329.63, duration: 1.2 }, 

    { note: 261.63, duration: 0.4 }, 
    { note: 261.63, duration: 0.4 }, 
    { note: 293.66, duration: 0.8 }, 
    { note: 261.63, duration: 0.8 }, 
    { note: 392.00, duration: 0.8 }, 
    { note: 349.23, duration: 1.2 },
  ];

  let currentTime = audioCtx.currentTime;

  notes.forEach((item) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(item.note, currentTime);

    gain.gain.setValueAtTime(0.3, currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, currentTime + item.duration - 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(currentTime);
    osc.stop(currentTime + item.duration);

    currentTime += item.duration;
  });
}

document.getElementById('musicBtn').addEventListener('click', playMelody);

