import './style.css'

const canvas = document.getElementById('simulationCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const sideCountInput = document.getElementById('sideCount') as HTMLInputElement;
const sideCountLabel = document.getElementById('sideCountLabel')!;
const perimeterInput = document.getElementById('perimeter') as HTMLInputElement;
const perimeterLabel = document.getElementById('perimeterLabel')!;
const sidesValueDisplay = document.getElementById('sidesValue')!;
const areaValueDisplay = document.getElementById('areaValue')!;
const maxAreaDisplay = document.getElementById('maxArea')!;
const efficiencyDisplay = document.getElementById('efficiency')!;

let k = parseInt(sideCountInput.value);
let L = parseInt(perimeterInput.value);

function resizeCanvas() {
    const rect = canvas.parentElement!.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    draw();
}

/**
 * Calculates the area of a regular k-sided polygon with perimeter L.
 * Formula: A = (L^2) / (4 * k * tan(PI / k))
 */
function calculateArea(k: number, L: number): number {
    return (L * L) / (4 * k * Math.tan(Math.PI / k));
}

/**
 * Calculates the area of a circle with perimeter (circumference) L.
 * Formula: A = (L^2) / (4 * PI)
 */
function calculateCircleArea(L: number): number {
    return (L * L) / (4 * Math.PI);
}

function draw() {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate radius for the circumcircle of the polygon
    // Side length s = L / k
    // Inradius r = s / (2 * tan(PI / k))
    // Circumradius R = s / (2 * sin(PI / k))
    const s = L / k;
    const R = s / (2 * Math.sin(Math.PI / k));

    // Draw circumcircle (guide)
    ctx.beginPath();
    ctx.arc(centerX, centerY, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw polygon
    ctx.beginPath();
    for (let i = 0; i < k; i++) {
        const angle = (i * 2 * Math.PI) / k - Math.PI / 2;
        const x = centerX + R * Math.cos(angle);
        const y = centerY + R * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Polygon Styling
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, R);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.4)');

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Update Stats
    const currentArea = calculateArea(k, L);
    const maxArea = calculateCircleArea(L);
    const efficiency = (currentArea / maxArea) * 100;

    sidesValueDisplay.textContent = k >= 50 ? "∞ (Circle)" : k.toString();
    areaValueDisplay.textContent = currentArea.toLocaleString(undefined, { maximumFractionDigits: 2 });
    maxAreaDisplay.textContent = maxArea.toLocaleString(undefined, { maximumFractionDigits: 2 });
    efficiencyDisplay.textContent = `${efficiency.toFixed(2)}%`;
}

sideCountInput.addEventListener('input', (e) => {
    k = parseInt((e.target as HTMLInputElement).value);
    sideCountLabel.textContent = k >= 50 ? "∞" : k.toString();
    draw();
});

perimeterInput.addEventListener('input', (e) => {
    L = parseInt((e.target as HTMLInputElement).value);
    perimeterLabel.textContent = L.toString();
    draw();
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
draw();
