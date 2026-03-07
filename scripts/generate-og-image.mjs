import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1200, H = 630;

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Dark navy background
ctx.fillStyle = '#0A1220';
ctx.fillRect(0, 0, W, H);

// Subtle gradient overlay
const grad = ctx.createLinearGradient(0, 0, W, H);
grad.addColorStop(0, 'rgba(16,27,45,0.8)');
grad.addColorStop(1, 'rgba(10,18,32,1)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

// Teal accent line at top
ctx.fillStyle = '#19B3A6';
ctx.fillRect(0, 0, W, 4);

// Brand name
ctx.fillStyle = '#19B3A6';
ctx.font = '600 16px "Helvetica Neue", Arial, sans-serif';
ctx.letterSpacing = '4px';
ctx.textAlign = 'left';
ctx.fillText('A G E   R E V I V E', 80, 200);

// Main headline
ctx.fillStyle = '#FFFFFF';
ctx.font = '700 52px "Helvetica Neue", Arial, sans-serif';
ctx.fillText('Daily NAD+.', 80, 280);

ctx.fillStyle = 'rgba(255,255,255,0.5)';
ctx.font = '700 52px "Helvetica Neue", Arial, sans-serif';
ctx.fillText('Mitochondrial & Gut Support.', 80, 345);

// Subline
ctx.fillStyle = 'rgba(255,255,255,0.45)';
ctx.font = '400 20px "Helvetica Neue", Arial, sans-serif';
ctx.fillText('Three fully disclosed formulas. One coordinated system.', 80, 410);

// Trust strip
const trustItems = ['Full Dose Disclosure', 'Third-Party Tested', 'No Proprietary Blends'];
ctx.fillStyle = 'rgba(255,255,255,0.3)';
ctx.font = '500 13px "Helvetica Neue", Arial, sans-serif';
let tx = 80;
trustItems.forEach((item, i) => {
  ctx.fillText(item.toUpperCase(), tx, 500);
  const metrics = ctx.measureText(item.toUpperCase());
  tx += metrics.width + 20;
  if (i < trustItems.length - 1) {
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(tx - 10, 490, 1, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
  }
});

// Bottom teal accent
ctx.fillStyle = '#19B3A6';
ctx.fillRect(0, H - 4, W, 4);

const buf = canvas.toBuffer('image/jpeg', { quality: 0.92 });
const outPath = join(__dirname, '..', 'client', 'public', 'images', 'og-default.jpg');
writeFileSync(outPath, buf);
console.log(`OG image written to ${outPath} (${buf.length} bytes)`);
