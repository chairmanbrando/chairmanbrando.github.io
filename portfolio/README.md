# Pixel portfolio (Svelte 5 + Vite)

    npm install
    npm run dev      # local dev server with live reload
    npm run build    # outputs static files to dist/

Where things are:
- src/lib/sites.js        the content (edit this to add/change sites)
- src/App.svelte          page layout, loops over sites
- src/lib/SiteCard.svelte one card
- src/lib/PixelImage.svelte  canvas pixelation (a Svelte action)
- src/lib/Modal.svelte    click-to-open popup
- src/app.css             palette and global styles

Deploy: push to GitHub, then in repo Settings > Pages set Source to "GitHub Actions".
If the repo isn't named "portfolio", change `base` in vite.config.js.
