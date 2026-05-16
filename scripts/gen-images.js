const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Gradient background (purple -> pink -> orange)
const grad = ctx.createLinearGradient(0, 0, W * 0.3, H);
grad.addColorStop(0, '#7c3aed');
grad.addColorStop(0.4, '#a855f7');
grad.addColorStop(0.7, '#ec4899');
grad.addColorStop(1, '#f97316');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

// Decorative circles
const circles = [
  [100, 80, 120, 0.12], [1100, 100, 80, 0.10],
  [950, 500, 150, 0.08], [200, 550, 100, 0.10],
  [600, 50, 60, 0.08], [50, 350, 70, 0.06],
];
circles.forEach(([cx, cy, r, a]) => {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
  ctx.fill();
});

// Brand tag pill
ctx.beginPath();
ctx.roundRect(460, 40, 280, 50, 25);
ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
ctx.fill();
ctx.font = '28px sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.textAlign = 'center';
ctx.fillText('🧠 MBTI 人格测试', 600, 73);

// Main title line 1
ctx.font = 'bold 100px sans-serif';
ctx.fillStyle = '#ffffff';
ctx.fillText('发现你的', 600, 200);

// Main title line 2 (yellow highlight)
ctx.fillStyle = '#fffde7';
ctx.fillText('MBTI 人格', 600, 320);

// Subtitle
ctx.font = '44px sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
ctx.fillText('28道题 · 3分钟 · 遇见真实的自己', 600, 420);

// Bottom social proof
ctx.font = '30px sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
ctx.fillText('✨ 已有 12,847 人完成测试', 600, 540);

// Decorative sparkle text
const sparkles = [[150, 200, '✦'], [1050, 180, '✧'], [300, 500, '✦'], [900, 450, '✧']];
ctx.font = '36px sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
sparkles.forEach(([x, y, ch]) => ctx.fillText(ch, x, y));

// Save OG image
const outPath = path.join('/tmp/mbti-platform/public', 'og-image.png');
const buf = canvas.toBuffer('image/png');
fs.writeFileSync(outPath, buf);
console.log('OG image saved:', buf.length, 'bytes');

// Generate favicon (64x64)
const favCanvas = createCanvas(64, 64);
const favCtx = favCanvas.getContext('2d');
const favGrad = favCtx.createLinearGradient(0, 0, 64, 64);
favGrad.addColorStop(0, '#7c3aed');
favGrad.addColorStop(0.5, '#ec4899');
favGrad.addColorStop(1, '#f97316');
favCtx.beginPath();
favCtx.arc(32, 32, 30, 0, Math.PI * 2);
favCtx.fillStyle = favGrad;
favCtx.fill();
favCtx.font = '32px sans-serif';
favCtx.textAlign = 'center';
favCtx.textBaseline = 'middle';
favCtx.fillText('🧠', 32, 33);

const favPath = path.join('/tmp/mbti-platform/public', 'favicon.ico');
fs.writeFileSync(favPath, favCanvas.toBuffer('image/png'));
console.log('Favicon saved:', fs.statSync(favPath).size, 'bytes');

// Apple touch icon (180x180)
const appleCanvas = createCanvas(180, 180);
const appleCtx = appleCanvas.getContext('2d');
const appleGrad = appleCtx.createLinearGradient(0, 0, 180, 180);
appleGrad.addColorStop(0, '#7c3aed');
appleGrad.addColorStop(0.5, '#ec4899');
appleGrad.addColorStop(1, '#f97316');
appleCtx.beginPath();
appleCtx.roundRect(0, 0, 180, 180, 36);
appleCtx.fillStyle = appleGrad;
appleCtx.fill();
appleCtx.font = '90px sans-serif';
appleCtx.textAlign = 'center';
appleCtx.textBaseline = 'middle';
appleCtx.fillText('🧠', 90, 93);

const applePath = path.join('/tmp/mbti-platform/public', 'apple-touch-icon.png');
fs.writeFileSync(applePath, appleCanvas.toBuffer('image/png'));
console.log('Apple touch icon saved:', fs.statSync(applePath).size, 'bytes');
