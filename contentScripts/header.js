const API_URL = "https://gotgood.ai/api/user/login/";

async function login(email, password) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        redirect: 'follow'
    });
    const { auth_token } = await response.json();
    localStorage.setItem("token", auth_token);
}

async function doLogin() {
    try {
        await login("root@gmail.com", "root");
        console.log("Успешная аутентификация!");
    } catch (error) {
        console.error("Ошибка аутентификации:", error);
    }
}

doLogin();



let menuOpened = false;

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
const accountSettings = createElement("div", "settings");
const settingsMenuLink = createElement("a", "menu");
const settingsMenuImg = createElement("img");
settingsMenuImg.src = chrome.runtime.getURL('assets/images/menu.svg');
settingsMenuImg.setAttribute("alt", "");

logoH2.appendChild(logoH2Span);
logo.appendChild(logoH2);
header.appendChild(logo);
account.appendChild(accountUser);
settingsMenuLink.appendChild(settingsMenuImg);
accountSettings.appendChild(settingsMenuLink);
account.appendChild(accountSettings);
header.appendChild(account);
document.body.appendChild(header);

settingsMenuLink.onclick = async () => {
    if (menuOpened) {
        document.getElementsByClassName("menu_content")[0].classList.remove("active");
        document.getElementsByClassName("flex h-full max-w-full flex-1 flex-col")[0].classList.remove("active");

    } else {
        document.getElementsByClassName("menu_content")[0].classList.add("active");
        document.getElementsByClassName("flex h-full max-w-full flex-1 flex-col")[0].classList.add("active");
        await getCategories();
    }


    menuOpened = !menuOpened;
};
setInterval(() => {
    let el = document.getElementsByClassName("flex h-full max-w-full flex-1 flex-col")[0];
    let menuReallyOpened = el.classList.contains("active");
    if (menuReallyOpened && !menuOpened) {
        el.classList.remove("active");
    } else if (!menuReallyOpened && menuOpened) {
        el.classList.add("active");
    }

}, 1000);
