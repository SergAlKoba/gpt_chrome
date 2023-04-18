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
      themeHref = 'global_styles.css';
      
      break;
  }

  let themeStylesheet = document.getElementById(themeStylesheetId);
  if (!themeStylesheet) {
    themeStylesheet = document.createElement('link');
    themeStylesheet.id = themeStylesheetId;
    themeStylesheet.rel = 'stylesheet';
    document.head.appendChild(themeStylesheet);
  }

  themeStylesheet.href = chrome.runtime.getURL('');
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

document.body.setAttribute('id', 'global');
document.body.innerHTML += `
<div class="menu_content active">
            <form>
                <button><img src="${chrome.runtime.getURL('assets/images/search.svg')}" alt=""></button>
                <input type="search" placeholder="Search...">
            </form>
            <ul class="categories">
                <li class="active"><img src="${chrome.runtime.getURL('assets/images/categories_img.svg')}" alt=""> Categories</li>
                <ul class="items">
                    <li>
                        <span style="background: #B4F573;"></span> Finance
                        <div class="story_content">
                            <div>
                                <p>I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage</p>
                            </div>
                            <div>
                                <p>I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage</p>
                            </div>
                            <div>
                                <p>I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage</p>
                            </div>
                            <div>
                                <p>I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage</p>
                            </div>
                        </div>
                    </li>
                    <li><span style="background: #FFA959;"></span> Artificial Intelligence</li>
                    <li><span style="background: #59FFE1;"></span> Education</li>
                    <li><span style="background: #8B9D64;"></span> Bussiness</li>
                    <li><span style="background: #8E649D;"></span> Sports</li>
                </ul>
            </ul>
            <ul class="favourites">
                <li><img src="assets/images/favourites_img.svg" alt=""> Favourites</li>
            </ul>
            <a class="purchased_prompts" href="javascript:void(0)"><img src="${chrome.runtime.getURL('assets/images/purchased_prompts_img.svg')}" alt=""> Purchased Prompts</a>
            <a class="discover_more" href="javascript:void(0)">Discover more</a>
        </div>
`
document.body.innerHTML += `
<header class="header_global">
        <div class="logo">
            <h2>Got <span>Good.</span></h2>
        </div>
        <div class="account">
            <div class="user">
                <span>Artificial Intelligence chat room</span>\
            </div>
            <div class="settings">
                <a class="favorites" href="javascript:void(0)"><img src="${chrome.runtime.getURL('./assets/images/favorites.svg')}" alt=""></a>
                <a class="share" href="javascript:void(0)"><img src="${chrome.runtime.getURL('./assets/images/share.svg')}" alt=""></a>
                <a class="menu" href="javascript:void(0)"><img src="${chrome.runtime.getURL('assets/images/menu.svg')}" alt=""></a>
            </div>
        </div>
    </header>
`

document.body.innerHTML += `
<div class="theme_settings_content" style="display: none;">
        <div class="settings_content">
            <form action="">
                <button><img src="${chrome.runtime.getURL('assets/images/search.svg')}" alt=""></button>
                <input type="search" placeholder="Search theme...">
            </form>
            <div class="tabs">
                <ul class="tabs_nav">
                    <li data-tabs="tone" class="tabs_item active">Tone</li>
                    <li data-tabs="style" class="tabs_item">Style</li>
                </ul>
                <div class="tabs_nav_content tone"></div>
                <div class="tabs_nav_content style"></div>
            </div>
        </div>
    </div>
`

// document.querySelector('#global .flex.h-full.max-w-full.flex-1.flex-col').classList.add('active')


