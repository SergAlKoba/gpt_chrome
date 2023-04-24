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
  
  settingsMenuLink.onclick = () => {
    document.getElementsByClassName("menu_content")[0].classList.toggle("active");
    document.getElementsByClassName("flex h-full max-w-full flex-1 flex-col")[0].classList.toggle("active");
  };
  