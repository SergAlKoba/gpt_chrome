function addCustomizeThemeButton() {
  const updatesAndFAQ = document.querySelector('YOUR_SELECTOR_HERE');
  if (updatesAndFAQ) {
    const customizeThemeButton = document.createElement('button');
    customizeThemeButton.textContent = 'Customize Themes';
    customizeThemeButton.id = 'customize-theme-button';
    updatesAndFAQ.parentNode.insertBefore(customizeThemeButton, updatesAndFAQ.nextSibling);
    return customizeThemeButton;
  }
  return null;
}

function applyTheme(theme) {
  const themeStylesheetId = 'chatgpt-theme-stylesheet';
  let themeHref = '';

  switch (theme) {
    case 'default':
      themeHref = 'default-theme.css';
      break;
    case 'dark':
      themeHref = 'dark-theme.css';
      break;
    case 'light':
      themeHref = 'light-theme.css';
      break;
    case 'advanced':
      themeHref = 'advanced-theme.css';
      break;
    default:
      break;
  }

  let themeStylesheet = document.getElementById(themeStylesheetId);
  if (!themeStylesheet) {
    themeStylesheet = document.createElement('link');
    themeStylesheet.id = themeStylesheetId;
    themeStylesheet.rel = 'stylesheet';
    document.head.appendChild(themeStylesheet);
  }

  themeStylesheet.href = chrome.runtime.getURL(themeHref);
}

const customizeThemeButton = addCustomizeThemeButton();

if (customizeThemeButton) {
  customizeThemeButton.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'open_popup' });
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.theme) {
    applyTheme(request.theme);
  }
});
