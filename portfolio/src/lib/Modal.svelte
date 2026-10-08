<script>
  import { fade } from "svelte/transition";
  let { site, onclose } = $props();

  function backdropClick(e) {
    if (e.target === e.currentTarget) onclose();
  }
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && onclose()} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="backdrop" onclick={backdropClick} transition:fade={{ duration: 120 }}>
  <div class="box" role="dialog" aria-modal="true" aria-label={site.domain}>
    <h3>{site.domain}</h3>
    <div class="scroll">
      <img src={site.full} alt="{site.domain} screenshot" />
    </div>
    <p>{site.blurb}</p>
    <button onclick={onclose}>[ close ]</button>
  </div>
</div>

<style>
  .backdrop {
    background: rgba(10, 3, 20, 0.85);
    display: grid;
    inset: 0;
    padding: 1rem;
    place-items: center;
    position: fixed;
    z-index: 10;
  }

  .box {
    background: var(--panel);
    box-shadow:
      0 0 0 var(--px) var(--neon),
      12px 12px 0 var(--px) #0008;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    max-height: 80vh;
    max-width: 742px;
    padding: 1.5rem;
    width: 100%;
  }

  .scroll {
    border: var(--px) solid var(--bg);
    overflow-y: auto;
  }

  h3 {
    color: var(--neon);
    font-size: 0.8rem;
  }

  img {
    display: block;
    width: 100%;
  }

  p {
    margin: 0;
  }

  button {
    align-self: flex-end;
    background: var(--bg);
    border: var(--px) solid var(--neon);
    color: var(--neon);
    font: inherit;
    padding: 0.25rem 0.75rem;

    &:hover {
      background: var(--neon);
      color: var(--bg);
    }
  }
</style>
