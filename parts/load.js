/**
 * Find and load all the template partials on the current page. When they're all
 * loaded, add a class to the body to let everyone know.
 */
document.addEventListener('DOMContentLoaded', e => {
	const proms = [];

	document.querySelectorAll('div.partial').forEach(part => {
		const url = part.getAttribute('data-partial');

		proms.push(
			fetch(url)
				.then(response => response.text())
				.then(html => {
					part.innerHTML = html;
				})
		);
	});

	Promise.all(proms).then(nada => document.body.classList.add('partials-loaded'));
});
