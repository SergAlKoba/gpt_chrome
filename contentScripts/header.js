async function login(email, password) {
    const response = await $.ajax({
      url: "https://gotgood.ai/api/user/login/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ email, password }),
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
  
  function createMenu() {
    let menuOpened = false;
  
    const createElement = (tagName, className) => {
      const element = $("<" + tagName + ">").addClass(className);
      return element;
    };
  
    const header = createElement("header", "header_global");
    const logo = createElement("div", "logo");
    const logoH2 = createElement("h2");
    logoH2.text("Got ");
    const logoH2Span = createElement("span");
    logoH2Span.text("Good.");
    const account = createElement("div", "account");
    const accountUser = createElement("div", "user");
    const accountSettings = createElement("div", "settings");
    const settingsMenuLink = createElement("a", "menu");
    const settingsMenuImg = createElement("img");
    settingsMenuImg.attr("src", chrome.runtime.getURL('assets/images/menu.svg'));
    settingsMenuImg.attr("alt", "");
  
    logoH2.append(logoH2Span);
    logo.append(logoH2);
    header.append(logo);
    account.append(accountUser);
    settingsMenuLink.append(settingsMenuImg);
    accountSettings.append(settingsMenuLink);
    account.append(accountSettings);
    header.append(account);
    $("body").append(header);
  
    settingsMenuLink.on("click", async () => {
      if (menuOpened) {
        $(".menu_content").removeClass("active");
        $(".flex.h-full.max-w-full.flex-1.flex-col").removeClass("active");
      } else {
        $(".menu_content").addClass("active");
        $(".flex.h-full.max-w-full.flex-1.flex-col").addClass("active");
        await getCategories();
      }
  
      menuOpened = !menuOpened;
    });
  
    setInterval(() => {
      let el = $(".flex.h-full.max-w-full.flex-1.flex-col");
      let menuReallyOpened = el.hasClass("active");
      if (menuReallyOpened && !menuOpened) {
        el.removeClass("active");
      } else if (!menuReallyOpened && menuOpened) {
        el.addClass("active");
      }
    }, 1000);
  }
  
  async function initializeApp() {
    try {
      await doLogin();
      createMenu();
    } catch (error) {
      console.error("Ошибка при инициализации приложения:", error);
    }
  }
  
  initializeApp();
  