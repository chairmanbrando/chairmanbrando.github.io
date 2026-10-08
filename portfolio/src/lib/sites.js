// @todo Pull the images into `/public` instead.
const base = 'https://chairmanbrando.org/wp-content/uploads/2025/10/p-';

const s = (domain, file, blurb) => ({
  domain,
  preview: `${base}${file}.png`,
  full: `${base}${file.replace(/-\d+x\d+$/, '-scaled')}.png`,
  blurb
});

export const sites = [
  s('acluva.org', 'acluva-748x1024', "Long before Gutenberg was a thing, I had to make these guys a new theme that worked with their existing piles and piles of content."),
  s('amfamfit.com', 'amfamfit-512x383', "The site was okay for the time, I guess. More importantly, I built a custom class schedule system with CakePHP and `date()` math. It even supported repeating events!"),
  s('artonproducts.com', 'artonproducts-409x1024', "The design wasn't much, but the hoops I pushed WooCommerce through to match their internal pricing were some kind of insane."),
  s('brownbev.com', 'brownbev-450x1024', "Maybe the first site I put together once Gutenberg became a thing. Mostly heavily restyled blocks."),
  s('carpenter.com', 'carpenter-486x1024', "The latest redesign and rebuild of several. I've been involved behind the scenes (none of them know who I am!) since they were flat HTML files and then ExpressionEngine."),
  s('chickahominyfalls.com', 'chickahominyfalls-434x1024', "The real meat of this build was the interactive map highlighting their neighborhoods. I probably should've screenshot that instead, eh?"),
  s('chrispeace.com', 'chrispeace-512x350', "One of the prettiest sites I built with all its little heavily-designed details. We lost something when the web moved to phones. 🙃"),
  s('copperpoint.com', 'copperpoint-347x512', "I had to use Drupal to make this. Gross."),
  s('covenantschool.org', 'covenantschool-512x294', "I don't remember much about this one, but it's clearly from the same era as chrispeace.com!"),
  s('dime.com', 'dime-399x1024', "After years on Drupal they wanted something on WordPress that they could update more easily. I don't blame them. The original design was better, more blue and stuff, but a third party got involved."),
  s('dime.com/golf', 'dime-golf-340x1024', "One of a slew of landing pages made from one-page templates (using a minimal theme built for everything being one-off templates) and ACF fields."),
  s('hivesalonstudios.com', 'hivesalonstudios-344x1024', "A blocky site with an animated SVG mask logo and background videos in every hero."),
  s('mckinneyrsa.com', 'mckinneyrsa-332x1024', "More Gutenberg block goodness... this time with weed! It's been legal in Virginia for years, but retail sales still won't start until July 2027!"),
  s('riverspan.com', 'riverspan-490x1024', "Slanty things made from SVG masks are kinda neat, I guess."),
  s('rpdo.com', 'rpdo-545x1024', "This one was sadly redone in Elementor (by someone else) for some reason. It was much nicer before, I think!"),
  s('rvanews.com', 'rvanews-499x1024', "Note: Various empty spaces had local ads in them that didn't get picked up by the web archiver. Anywhomst, have you ever been involved in something cooler than you realized and appreciated at the time? Take me back to before this past Decade of Utter Nonsense. 🫠"),
  s('stylecrafthomes.com', 'stylecrafthomes-407x1024', "Built this site twice. The first had direct integration with their NEWSTAR API. The second was disconnected and used metadata fields for easier updating. Eventually a SaaS system combining the back and front ends yoinked it away from us."),
  s('yardworksva.com', 'yardworksva-312x1024', "They *finally* caved and go for a much-needed redesign after more than a decade. Not six months later the company was bought and the site remade in yet another SaaS platform. 😡")
];
