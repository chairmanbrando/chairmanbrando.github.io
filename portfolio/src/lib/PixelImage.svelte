<script>
  let { src, alt, size = 72 } = $props();

  // The image is drawn to a small canvas and then scaled up.
  function pixelate(canvas, url) {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const ratio = img.height / img.width;
      canvas.width = size;
      canvas.height = Math.round(size * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = url;
  }
</script>

<div role="img" aria-label={alt}>
  <canvas use:pixelate={src} aria-hidden="true"></canvas>
</div>

<style>
  canvas {
    display: block;
    height: auto;
    image-rendering: pixelated;
    width: 100%;
  }
</style>
