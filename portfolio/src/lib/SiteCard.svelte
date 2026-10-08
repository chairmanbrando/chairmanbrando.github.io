<script>
  import PixelImage from "./PixelImage.svelte";

  let { site, onopen } = $props();
</script>

<button class="card" onclick={onopen}>
  <div class="shot">
    <PixelImage src={site.preview} alt="{site.domain} screenshot" />
  </div>
  <h3>{site.domain}</h3>
</button>

<style>
  .card {
    all: unset;
    background: var(--panel);
    box-shadow:
      0 0 0 var(--px) var(--edge),
      calc(var(--px) * 2) calc(var(--px) * 2) 0 var(--px) #0008;
    box-sizing: border-box;
    display: block;
    height: 100%;
    padding: 1rem;
    transition:
      transform 0.2s steps(2),
      box-shadow 0.2s steps(2);
    width: 100%;

    &:hover,
    &:focus-visible {
      box-shadow:
        0 0 0 var(--px) var(--neon),
        calc(var(--px) * 3) calc(var(--px) * 3) var(--px) var(--px) #0008;
      transform: translate(calc(var(--px) * -1), calc(var(--px) * -1));
    }

    &:focus-visible {
      outline: var(--px) dashed var(--neon);
      outline-offset: 8px;
    }
  }

  .shot {
    border: var(--px) solid var(--bg);
    margin-bottom: 1rem;
    max-height: 280px;
    overflow: hidden;
    position: relative;

    /* Add a slight purple tint for the aesthetics, I guess. */
    &::after {
      background: #6a2cff;
      content: "";
      inset: 0;
      mix-blend-mode: multiply;
      opacity: 0.25;
      pointer-events: none;
      position: absolute;
    }
  }

  h3 {
    color: var(--neon);
    font-size: 0.7rem;
    margin-bottom: 0;
    text-align: center;
    word-break: break-all;
  }
</style>
