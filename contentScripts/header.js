const createElement = (tagName, className) => {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
};

const header = createElement("header", "header_global");
const logo = createElement("div", "logo");
const logoH2 = createElement("h2");
logoH2.innerText = "Got ";
const logoH2Span = createElement("span");
logoH2Span.innerText = "Good.";
const account = createElement("div", "account");
const accountUser = createElement("div", "user");
const accountUserSpan = createElement("span");
accountUserSpan.innerText = "Artificial Intelligence chat room";
const accountSettings = createElement("div", "settings");
const settingsFavoritesLink = createElement("a", "favorites");
const settingsFavoritesImg = createElement("img");
settingsFavoritesImg.src = chrome.runtime.getURL('./assets/images/favorites.svg');
settingsFavoritesImg.setAttribute("alt", "");
const settingsShareLink = createElement("a", "share");
const settingsShareImg = createElement("img");
settingsShareImg.src = chrome.runtime.getURL('./assets/images/share.svg');
settingsShareImg.setAttribute("alt", "");
const settingsMenuLink = createElement("a", "menu");
const settingsMenuImg = createElement("img");
settingsMenuImg.src = chrome.runtime.getURL('assets/images/menu.svg');
settingsMenuImg.setAttribute("alt", "");

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

settingsMenuLink.onclick = () => {
document.getElementsByClassName("menu_content")[0].classList.toggle("active");

}