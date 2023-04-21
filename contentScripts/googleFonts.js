function createGoogleFontsLinkElement(href, rel, crossorigin) {
    const link = document.createElement('link');
    link.href = href;
    link.rel = rel;
    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }
    return link;
  }
  
  const preconnect1 = createGoogleFontsLinkElement('https://fonts.googleapis.com', 'preconnect');
  const preconnect2 = createGoogleFontsLinkElement('https://fonts.gstatic.com', 'preconnect', 'anonymous');
  const fonts = createGoogleFontsLinkElement('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Roboto:wght@100;300;400;500;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto+Condensed:wght@300;400;700&display=swap', 'stylesheet');
  
  document.head.appendChild(preconnect1);
  document.head.appendChild(preconnect2);
  document.head.appendChild(fonts);