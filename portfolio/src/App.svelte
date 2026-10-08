<script>
  import { sites } from "./lib/sites.js";
  import SiteCard from "./lib/SiteCard.svelte";
  import Modal from "./lib/Modal.svelte";

  let selected = $state(null);
</script>

<main>
  <header>
    <h2>The Web is Ephemeral</h2>
    <h1>So, here are some sites I built that may not exist anymore.</h1>
    <p>
      I've built a lot of 'em over the years, many for local businesses in and around Richmond, VA. I'm not the designer
      of these sites; I'm just the guy who put them together with code, mostly within the WordPress ecosystem. I haven't
      linked to any of them since there's no telling what's going on at each domain now. Some are still active in the
      state I left them while others are gone or have been redesigned once or thrice.
    </p>
    <p>
      I recently bought <a href="https://en.wikipedia.org/wiki/Vampire_Survivors">Vampire Survivors</a> and its three
      main DLCs for under $8 and keep having to fight to get some of its soundtrack out of my head. Forgive me for the
      absurd pixel&shy;ated look that I remade this page into. 🤷‍♀️
    </p>
  </header>

  <ul class="grid">
    {#each sites as site (site.domain)}
      <li><SiteCard {site} onopen={() => (selected = site)} /></li>
    {/each}
  </ul>
</main>

{#if selected}
  <Modal site={selected} onclose={() => (selected = null)} />
{/if}

<style>
  main {
    margin: 0 auto;
    max-width: 1100px;
    padding: 2rem 1rem 4rem;
  }

  header {
    margin-bottom: 3rem;
    max-width: 60ch;
  }

  h1 {
    font-size: clamp(1rem, 3vw, 1.5rem);
    margin-bottom: 1.5rem;
  }

  h2 {
    color: var(--neon);
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
