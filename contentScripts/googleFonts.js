function createGoogleFontsLinkElement(href, rel, crossorigin) {
  var link = $('<link>', {href: href, rel: rel});
  if (crossorigin) {
      link.attr('crossorigin', crossorigin);
  }
  return link;
}

var preconnect1 = createGoogleFontsLinkElement('https://fonts.googleapis.com', 'preconnect');
var preconnect2 = createGoogleFontsLinkElement('https://fonts.gstatic.com', 'preconnect', 'anonymous');
var fonts = createGoogleFontsLinkElement('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Roboto:wght@100;300;400;500;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto+Condensed:wght@300;400;700&display=swap', 'stylesheet');

$('head').append(preconnect1, preconnect2, fonts);
