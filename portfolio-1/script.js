window.addEventListener('DOMContentLoaded', (e) => {
    const popover  = document.querySelector('#popover');
    const sites    = document.querySelectorAll('.site');

    // Clicking anywhere will kill the popover, but clicking on the image will
    // also new-tab it because why not.
    popover.addEventListener('click', (e) => {
        if (e && e.target) {
            if (e.target.matches('img')) {
                open(e.target.src, '_blank');
            }
        }

        popover.hidePopover()
    });

    // Copy-paste the contents into the popover on click!
    sites.forEach((s) => {
        s.addEventListener('click', () => {
            popover.innerHTML = s.innerHTML.replace(/-\d+x\d+.png/, '-scaled.png');
        });
    });
});
