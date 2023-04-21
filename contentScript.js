function addCustomizeThemeButton() {
  const updatesAndFAQ = document.querySelector('nav > a:nth-child(7)')
  console.log(updatesAndFAQ);
  if (updatesAndFAQ) {
    const customizeThemeButton = document.createElement('button');
    customizeThemeButton.textContent = 'Customize Themes';
    customizeThemeButton.id = 'customize-theme-button';
    updatesAndFAQ.parentNode.insertBefore(customizeThemeButton, updatesAndFAQ.nextSibling);
    return customizeThemeButton;
  }
  return null;
}

function fetchApiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('got_good_token');
  let headers = {};
  if (token) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization':  token
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }

  const requestOptions = {
    method,
    headers,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = fetch(endpoint, requestOptions);
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

fetchApiRequest('', 'GET')

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

let menuContent = document.createElement("div");
menuContent.className = "menu_content active";


let menuContentForm = document.createElement("form");

let menuContentFormButton = document.createElement("button");

let menuContentFormButtonImg = document.createElement("img");
menuContentFormButtonImg.src = chrome.runtime.getURL('assets/images/search.svg');
menuContentFormButtonImg.setAttribute("alt", "");

menuContentFormButton.appendChild(menuContentFormButtonImg);
menuContentForm.appendChild(menuContentFormButton);

let menuContentFormInput = document.createElement("input");
menuContentFormInput.setAttribute("type", "search");
menuContentFormInput.setAttribute("placeholder", "Search...");

menuContentForm.appendChild(menuContentFormInput);

menuContent.appendChild(menuContentForm);



let menuContentCategories = document.createElement("ul");
menuContentCategories.className = "categories";

let menuContentCategoriesLi = document.createElement("li");
menuContentCategoriesLi.className = "active";

let menuContentCategoriesLiImg = document.createElement("img");
menuContentCategoriesLiImg.src = chrome.runtime.getURL('assets/images/categories_img.svg');
menuContentCategoriesLiImg.setAttribute("alt", "");

menuContentCategoriesLi.appendChild(menuContentCategoriesLiImg);

let menuContentCategoriesLiText = document.createTextNode(" Categories");

menuContentCategoriesLi.appendChild(menuContentCategoriesLiText);

menuContentCategories.appendChild(menuContentCategoriesLi);

let menuContentCategoriesItems = document.createElement("ul");
menuContentCategoriesItems.className = "items";

let menuContentCategoriesItemsLi = document.createElement("li");

let menuContentCategoriesItemsLiSpan = document.createElement("span");
menuContentCategoriesItemsLiSpan.style = "background: #B4F573";

menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiSpan);

let menuContentCategoriesItemsLiText = document.createTextNode(" Finance");

menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiText);

let menuContentCategoriesItemsLiStoryContent = document.createElement("div");

menuContentCategoriesItemsLiStoryContent.className = "story_content";


let menuContentCategoriesItemsLiStoryContentDiv1 = document.createElement("div");
let menuContentCategoriesItemsLiStoryContentDiv1P = document.createElement("p");
menuContentCategoriesItemsLiStoryContentDiv1P.innerText = "I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage";

menuContentCategoriesItemsLiStoryContentDiv1.appendChild(menuContentCategoriesItemsLiStoryContentDiv1P);
menuContentCategoriesItemsLiStoryContent.appendChild(menuContentCategoriesItemsLiStoryContentDiv1);

let menuContentCategoriesItemsLiStoryContentDiv2 = document.createElement("div");
let menuContentCategoriesItemsLiStoryContentDiv2P = document.createElement("p");
menuContentCategoriesItemsLiStoryContentDiv2P.innerText = "I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage";

menuContentCategoriesItemsLiStoryContentDiv2.appendChild(menuContentCategoriesItemsLiStoryContentDiv2P);
menuContentCategoriesItemsLiStoryContent.appendChild(menuContentCategoriesItemsLiStoryContentDiv2);

let menuContentCategoriesItemsLiStoryContentDiv3 = document.createElement("div");
let menuContentCategoriesItemsLiStoryContentDiv3P = document.createElement("p");
menuContentCategoriesItemsLiStoryContentDiv3P.innerText = "I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage";

menuContentCategoriesItemsLiStoryContentDiv3.appendChild(menuContentCategoriesItemsLiStoryContentDiv3P);
menuContentCategoriesItemsLiStoryContent.appendChild(menuContentCategoriesItemsLiStoryContentDiv3);

let menuContentCategoriesItemsLiStoryContentDiv4 = document.createElement("div");
let menuContentCategoriesItemsLiStoryContentDiv4P = document.createElement("p");
menuContentCategoriesItemsLiStoryContentDiv4P.innerText = "I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage";

menuContentCategoriesItemsLiStoryContentDiv4.appendChild(menuContentCategoriesItemsLiStoryContentDiv4P);
menuContentCategoriesItemsLiStoryContent.appendChild(menuContentCategoriesItemsLiStoryContentDiv4);

menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiStoryContent);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi);



let menuContentCategoriesItemsLi2 = document.createElement("li");
let menuContentCategoriesItemsLi2Span = document.createElement("span");

menuContentCategoriesItemsLi2Span.style = "background: #FFA959";

menuContentCategoriesItemsLi2.appendChild(menuContentCategoriesItemsLi2Span);

let menuContentCategoriesItemsLi2Text = document.createTextNode(" Artificial Intelligence");

menuContentCategoriesItemsLi2.appendChild(menuContentCategoriesItemsLi2Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi2);



let menuContentCategoriesItemsLi3 = document.createElement("li");
let menuContentCategoriesItemsLi3Span = document.createElement("span");

menuContentCategoriesItemsLi3Span.style = "background: #59FFE1";

menuContentCategoriesItemsLi3.appendChild(menuContentCategoriesItemsLi3Span);

let menuContentCategoriesItemsLi3Text = document.createTextNode(" Education");

menuContentCategoriesItemsLi3.appendChild(menuContentCategoriesItemsLi3Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi3);


let menuContentCategoriesItemsLi4 = document.createElement("li");
let menuContentCategoriesItemsLi4Span = document.createElement("span");

menuContentCategoriesItemsLi4Span.style = "background: #8B9D64";

menuContentCategoriesItemsLi4.appendChild(menuContentCategoriesItemsLi4Span);

let menuContentCategoriesItemsLi4Text = document.createTextNode(" Bussiness");

menuContentCategoriesItemsLi4.appendChild(menuContentCategoriesItemsLi4Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi4);



let menuContentCategoriesItemsLi5 = document.createElement("li");
let menuContentCategoriesItemsLi5Span = document.createElement("span");

menuContentCategoriesItemsLi5Span.style = "background: #8E649D";

menuContentCategoriesItemsLi5.appendChild(menuContentCategoriesItemsLi5Span);

let menuContentCategoriesItemsLi5Text = document.createTextNode(" Sports");

menuContentCategoriesItemsLi5.appendChild(menuContentCategoriesItemsLi5Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi5);



menuContentCategories.appendChild(menuContentCategoriesItems);
menuContent.appendChild(menuContentCategories);

let menuContentFavorites = document.createElement("ul");
menuContentFavorites.className = "favourites";

let menuContentFavoritesLi = document.createElement("li");
let menuContentFavoritesLiImg = document.createElement("img");
menuContentFavoritesLiImg.src = chrome.runtime.getURL('assets/images/favourites_img.svg');
menuContentFavoritesLiImg.setAttribute("alt", "");

menuContentFavoritesLi.appendChild(menuContentFavoritesLiImg);

let menuContentFavoritesLiText = document.createTextNode(" Favourites");

menuContentFavoritesLi.appendChild(menuContentFavoritesLiText);
menuContentFavorites.appendChild(menuContentFavoritesLi);
menuContent.appendChild(menuContentFavorites);

let menuContentPurchasedPrompts = document.createElement("a");
menuContentPurchasedPrompts.className = "purchased_prompts";
menuContentPurchasedPrompts.setAttribute("href","javascript:void(0)");


let menuContentPurchasedPromptsImg = document.createElement("img");
menuContentPurchasedPromptsImg.src = chrome.runtime.getURL('assets/images/purchased_prompts_img.svg');
menuContentPurchasedPromptsImg.setAttribute("alt","");

menuContentPurchasedPrompts.appendChild(menuContentPurchasedPromptsImg);

let menuContentPurchasedPromptsText = document.createTextNode(" Purchased Prompts");
menuContentPurchasedPrompts.appendChild(menuContentPurchasedPromptsText);
menuContent.appendChild(menuContentPurchasedPrompts);

let menuContentDiscoverMore = document.createElement("a");
menuContentDiscoverMore.className = "discover_more";
menuContentDiscoverMore.setAttribute("href","javascript:void(0)");

let menuContentDiscoverMoreText = document.createTextNode("Discover more");
menuContentDiscoverMore.appendChild(menuContentDiscoverMoreText);

menuContent.appendChild(menuContentDiscoverMore);

document.body.appendChild(menuContent);




let header = document.createElement("header");
header.className = 'header_global';

let logo = document.createElement("div");
logo.className = 'logo';

let logoH2 = document.createElement("h2");
logoH2.innerText = "Got ";

let logoH2Span = document.createElement("span");
logoH2Span.innerText = "Good.";

let account = document.createElement("div");
account.className = "account";

let accountUser = document.createElement("div");
accountUser.className = "user";

let accountUserSpan = document.createElement("span");
accountUserSpan.innerText = "Artificial Intelligence chat room";

let accountSettings = document.createElement("div");
accountSettings.className = "settings";

let settingsFavoritesImg = document.createElement("img");
settingsFavoritesImg.src = chrome.runtime.getURL('./assets/images/favorites.svg');
settingsFavoritesImg.setAttribute("alt", "");

let settingsShareImg = document.createElement("img");
settingsShareImg.src = chrome.runtime.getURL('./assets/images/share.svg');
settingsShareImg.setAttribute("alt", "");

let settingsMenuImg = document.createElement("img");
settingsMenuImg.src = chrome.runtime.getURL('assets/images/menu.svg');
settingsMenuImg.setAttribute("alt", "");

let settingsFavoritesLink = document.createElement("a");
settingsFavoritesLink.className = 'favorites';

let settingsShareLink = document.createElement("a");
settingsShareLink.className = 'share';

let settingsMenuLink = document.createElement("a");
settingsMenuLink.className = 'menu';

logoH2.appendChild(logoH2Span);
logo.appendChild(logoH2);
header.appendChild(logo);
accountUser.appendChild(accountUserSpan);
account.appendChild(accountUser);
settingsFavoritesLink.appendChild(settingsFavoritesImg);
settingsShareLink.appendChild(settingsShareImg);
settingsMenuLink.appendChild(settingsMenuImg);
accountSettings.appendChild(settingsFavoritesLink);
accountSettings.appendChild(settingsShareLink);
accountSettings.appendChild(settingsMenuLink);
account.appendChild(accountSettings);
header.appendChild(account);
document.body.appendChild(header);




let themeSettingsContent = document.createElement("div");
themeSettingsContent.className = "theme_settings_content";
themeSettingsContent.style = "display: none";

let settingsContent = document.createElement("div");
settingsContent.className = "settings_content";

let settingsContentForm = document.createElement("form");
settingsContentForm.setAttribute("action", "");

let settingContentFormButton = document.createElement("button");

let settingContentFormButtonImg = document.createElement("img");
settingContentFormButtonImg.src = chrome.runtime.getURL('assets/images/search.svg');
settingContentFormButtonImg.setAttribute("alt", "");

let settingContentFormInput = document.createElement("input");
settingContentFormInput.setAttribute("type", "search");
settingContentFormInput.setAttribute("placeholder", "Search theme...");

let settingContentTabs = document.createElement("div");
settingContentTabs.className = "tabs";

let settingContentTabsList = document.createElement("ul");
settingContentTabsList.className = "tabs_nav";

let liTone = document.createElement("li");
liTone.setAttribute("data-tabs", "tone");
liTone.classList.add("tabs_item", "active");
liTone.innerText = "Tone";

let liStyle = document.createElement('li');
liStyle.setAttribute("data-tabs", "style");
liStyle.classList.add("tabs_item");
liStyle.innerText = "Style";

let settingContentTabsTone = document.createElement("div");
settingContentTabsTone.className = "tabs_nav_content tone";
let settingContentTabsStyle = document.createElement("div");
settingContentTabsStyle.className = "tabs_nav_content style";

settingContentTabs.appendChild(settingContentTabsStyle);
settingContentTabs.appendChild(settingContentTabsTone);
settingContentTabsList.appendChild(liTone);
settingContentTabsList.appendChild(liStyle);
settingContentTabs.appendChild(settingContentTabsList);
settingsContentForm.appendChild(settingContentFormInput);
settingContentFormButton.appendChild(settingContentFormButtonImg);
settingsContentForm.appendChild(settingContentFormButton);
settingsContent.appendChild(settingContentTabs);
settingsContent.appendChild(settingsContentForm);
themeSettingsContent.appendChild(settingsContent);
document.body.appendChild(themeSettingsContent);



// document.querySelector('#global .flex.h-full.max-w-full.flex-1.flex-col').classList.add('active')


