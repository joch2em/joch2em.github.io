const canvas = document.getElementById('grassCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawGrass() {
    const grassBlades = 500;
    for (let i = 0; i < grassBlades; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const height = Math.random() * 20 + 10;
        const width = Math.random() * 2 + 1;
        ctx.fillStyle = '#388E3C'; // Darker green for grass blades
        ctx.fillRect(x, y, width, height);
    }
}

drawGrass();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrass();
});