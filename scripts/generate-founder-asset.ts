import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import jpeg from 'jpeg-js';

// Directories to ensure exist
const targets = [
  path.join(process.cwd(), 'public', 'images', 'founder'),
  path.join(process.cwd(), 'public', 'assets'),
  path.join(process.cwd(), 'dist', 'images', 'founder'),
  path.join(process.cwd(), 'dist', 'assets'),
  path.join(process.cwd(), 'src', 'assets'),
];

for (const dir of targets) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Create a high-fidelity, elegant portrait SVG (3:4 ratio - 600x800)
const founderSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050c1e" />
      <stop offset="50%" stop-color="#0b1736" />
      <stop offset="100%" stop-color="#020612" />
    </linearGradient>

    <!-- Studio Tech Glow -->
    <radialGradient id="glowBackdrop" cx="50%" cy="38%" r="48%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#0369a1" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#0b1736" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#24324a" />
      <stop offset="50%" stop-color="#152033" />
      <stop offset="100%" stop-color="#0b101c" />
    </linearGradient>

    <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#dbeafe" />
    </linearGradient>

    <linearGradient id="tieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d99f70" />
      <stop offset="50%" stop-color="#c68552" />
      <stop offset="100%" stop-color="#a4683c" />
    </linearGradient>

    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>

    <!-- Pattern -->
    <pattern id="dotPattern" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#38bdf8" fill-opacity="0.12" />
    </pattern>

    <filter id="portraitShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.75" />
    </filter>
  </defs>

  <style>
    .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  </style>

  <!-- Frame Background -->
  <rect width="600" height="800" fill="url(#bgGradient)" />
  <rect width="600" height="800" fill="url(#dotPattern)" />
  <circle cx="300" cy="320" r="280" fill="url(#glowBackdrop)" />

  <!-- Geometric Tech Circuit Motifs -->
  <g stroke="#0284c7" stroke-width="1.2" stroke-opacity="0.3" fill="none">
    <path d="M 50 120 L 140 120 L 180 160" />
    <circle cx="50" cy="120" r="3" fill="#38bdf8" />
    <path d="M 550 140 L 460 140 L 420 180" />
    <circle cx="550" cy="140" r="3" fill="#38bdf8" />
    <path d="M 80 680 L 160 680 L 200 640" />
    <circle cx="80" cy="680" r="3" fill="#38bdf8" />
  </g>

  <!-- Portrait Center Group: Photorealistic Executive Tech Composition -->
  <g id="executive-portrait" transform="translate(0, 40)">
    <!-- Soft Studio Backlight Halo -->
    <ellipse cx="300" cy="310" rx="170" ry="210" fill="#0284c7" fill-opacity="0.25" filter="url(#portraitShadow)" />

    <!-- Shoulders & Dark Charcoal Navy Tailored Suit -->
    <path d="M 115 720 C 125 540 185 470 240 445 L 300 480 L 360 445 C 415 470 475 540 485 720 Z" fill="url(#suitGrad)" filter="url(#portraitShadow)" />
    
    <!-- Tailored Suit Lapels (Left & Right) with sharp subtle highlight -->
    <path d="M 235 448 L 290 600 L 265 720 L 180 720 L 165 560 Z" fill="#152033" stroke="#334155" stroke-width="1.2" />
    <path d="M 365 448 L 310 600 L 335 720 L 420 720 L 435 560 Z" fill="#0d1524" stroke="#334155" stroke-width="1.2" />
    <path d="M 235 448 L 290 600" stroke="#38bdf8" stroke-width="0.8" stroke-opacity="0.4" />

    <!-- Crisp White Collared Dress Shirt (Open Collar, No Tie) -->
    <path d="M 265 435 L 300 480 L 335 435 L 320 620 L 280 620 Z" fill="url(#shirtGrad)" />
    <!-- Collar Lapels -->
    <path d="M 265 435 L 298 465 L 278 485 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.75" />
    <path d="M 335 435 L 302 465 L 322 485 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.75" />
    <path d="M 300 485 L 300 620" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,6" />

    <!-- Neck & V-line with studio shadow -->
    <path d="M 270 365 L 330 365 L 330 440 L 270 440 Z" fill="url(#skinGrad)" />
    <path d="M 270 405 C 285 430 315 430 330 405 L 330 440 L 270 440 Z" fill="#78350f" fill-opacity="0.3" />

    <!-- Head & Strong Executive Jawline -->
    <path d="M 226 270 C 226 170 374 170 374 270 C 374 345 348 395 300 400 C 252 395 226 345 226 270 Z" fill="url(#skinGrad)" filter="url(#portraitShadow)" />

    <!-- Side Rim Lighting on Face & Neck -->
    <path d="M 230 270 C 230 200 280 180 300 180 C 280 200 240 230 236 330 C 248 375 275 390 300 398 C 265 395 235 365 230 270 Z" fill="#38bdf8" fill-opacity="0.2" />

    <!-- Ears -->
    <ellipse cx="225" cy="275" rx="9" ry="16" fill="#c68552" />
    <ellipse cx="375" cy="275" rx="9" ry="16" fill="#a4683c" />

    <!-- Refined Modern Wavy Curly Hair (Dark Brunette / Black with Subtle Highlights) -->
    <path d="M 220 255 C 215 190 240 135 300 130 C 360 125 385 170 380 245 C 370 225 355 210 320 210 C 275 210 250 235 220 255 Z" fill="url(#hairGrad)" />
    <path d="M 218 250 C 222 225 240 200 272 188 C 310 170 365 178 378 220 C 368 200 338 180 305 180 C 260 180 235 215 218 250 Z" fill="#1e293b" />
    <circle cx="280" cy="160" r="15" fill="#334155" fill-opacity="0.3" />
    <circle cx="320" cy="155" r="18" fill="#334155" fill-opacity="0.3" />

    <!-- Confident Eyebrows -->
    <path d="M 250 245 Q 270 238 286 243" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none" />
    <path d="M 314 243 Q 330 238 350 245" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none" />

    <!-- Realistic Eyes (Deep, Focused Studio Gaze) -->
    <ellipse cx="268" cy="262" rx="10" ry="5.5" fill="#0f172a" />
    <circle cx="269" cy="261" r="3.5" fill="#1e293b" />
    <circle cx="270" cy="260" r="1.2" fill="#ffffff" />
    <path d="M 256 261 Q 268 254 280 261" stroke="#0f172a" stroke-width="1.8" fill="none" />

    <ellipse cx="332" cy="262" rx="10" ry="5.5" fill="#0f172a" />
    <circle cx="331" cy="261" r="3.5" fill="#1e293b" />
    <circle cx="332" cy="260" r="1.2" fill="#ffffff" />
    <path d="M 320 261 Q 332 254 344 261" stroke="#0f172a" stroke-width="1.8" fill="none" />

    <!-- Sculpted Nose with Studio Gradient -->
    <path d="M 298 252 L 296 288 L 304 288" stroke="#8d4f24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />

    <!-- Professional Composed Expression (Refined lips) -->
    <path d="M 282 322 Q 300 326 318 322" stroke="#683419" stroke-width="2.5" stroke-linecap="round" fill="none" />

    <!-- Neatly Groomed Mustache & Stubble Along Jawline -->
    <path d="M 284 312 Q 300 315 316 312" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="none" stroke-opacity="0.7" />
    <path d="M 252 320 C 260 365 280 392 300 394 C 320 392 340 365 348 320" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" stroke-opacity="0.45" />
  </g>

  <!-- ================= FOUNDER VERIFIED OVERLAY CARD ================= -->
  <g transform="translate(45, 660)">
    <!-- Glassmorphic Backdrop -->
    <rect width="510" height="95" rx="16" fill="#090f1d" fill-opacity="0.94" stroke="#0284c7" stroke-width="1.5" stroke-opacity="0.6" filter="url(#portraitShadow)" />

    <!-- Left Verified Shield -->
    <circle cx="52" cy="48" r="24" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1.5" />
    <path d="M 44 48 L 50 54 L 61 41" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Name & Designation -->
    <text x="92" y="38" fill="#ffffff" font-size="21" font-weight="800" class="font-sans">Srijan Singh</text>
    <text x="92" y="60" fill="#38bdf8" font-size="13" font-weight="600" class="font-sans">Founder &amp; Director • SrijanTech</text>
    <text x="92" y="78" fill="#94a3b8" font-size="11" font-weight="500" class="font-sans">📍 Varanasi, Uttar Pradesh, India</text>

    <!-- Official Badge -->
    <rect x="400" y="24" width="94" height="24" rx="6" fill="#0284c7" />
    <text x="447" y="40" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle" class="font-sans">OFFICIAL</text>
  </g>
</svg>`;

// Render real binary PNG
const resvg = new Resvg(founderSvg, {
  fitTo: { mode: 'width', value: 800 },
});
const rendered = resvg.render();
const pngBuffer = rendered.asPng();

// Encode real JFIF binary JPEG
const jpegData = jpeg.encode(
  {
    data: rendered.pixels,
    width: rendered.width,
    height: rendered.height,
  },
  92
);
const jpegBuffer = Buffer.from(jpegData.data);

// Define destination paths
const outputs = [
  { path: path.join(process.cwd(), 'public', 'images', 'founder', 'srijan-singh-founder.jpg'), data: jpegBuffer },
  { path: path.join(process.cwd(), 'public', 'images', 'founder', 'srijan-singh-founder.png'), data: pngBuffer },
  { path: path.join(process.cwd(), 'public', 'assets', 'founder.jpg'), data: jpegBuffer },
  { path: path.join(process.cwd(), 'public', 'assets', 'founder.jpeg'), data: jpegBuffer },
  { path: path.join(process.cwd(), 'public', 'assets', 'founder.png'), data: pngBuffer },
  { path: path.join(process.cwd(), 'public', 'assets', 'founder.svg'), data: Buffer.from(founderSvg, 'utf-8') },
  { path: path.join(process.cwd(), 'src', 'assets', 'founder.jpg'), data: jpegBuffer },
  { path: path.join(process.cwd(), 'dist', 'images', 'founder', 'srijan-singh-founder.jpg'), data: jpegBuffer },
  { path: path.join(process.cwd(), 'dist', 'assets', 'founder.jpg'), data: jpegBuffer },
  { path: path.join(process.cwd(), 'dist', 'assets', 'founder.jpeg'), data: jpegBuffer },
  { path: path.join(process.cwd(), 'dist', 'assets', 'founder.png'), data: pngBuffer },
];

for (const out of outputs) {
  const dir = path.dirname(out.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(out.path, out.data);
  console.log(`Saved: ${out.path} (${out.data.length} bytes)`);
}

console.log('Founder asset generation completed successfully.');
