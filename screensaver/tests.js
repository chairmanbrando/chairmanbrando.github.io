/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {int} x
 * @param {int} y
 * @param {int} width
 * @param {int} height
 * @param {int} radius
 * @param {string} color
 * @param {bool} fill
 */
export let roundedRect = function (ctx, x, y, width, height, radius, color, fill = true) {
    ctx.fillStyle   = color;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);

    (fill) ? ctx.fill() : ctx.stroke();
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {int} x
 * @param {int} y
 * @param {int} segments
 * @param {int} segmentSize
 */
export let cubedRect = function (ctx, x, y, segments = 7, segmentSize = 20) {
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
            let r = Math.floor(255 - (255 / segments) * i),
                g = 0,
                b = Math.floor(255 - (255 / segments) * j);

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(j * segmentSize + x, i * segmentSize + y, segmentSize, segmentSize);
        }
    }
};
