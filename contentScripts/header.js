let headerStatus = null;

let headerWasActive = false;

let menuOpened = false;
sessionStorage.setItem("menuOpened", true);
initialActiveForGlobal = false;

// async function login(email, password) {
//   const response = await fetch("https://gotgood.ai/api/user/login/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email,
//       password
//     }),
//     redirect: 'follow'
//   });

//   const responseData = await response.json();
//   const {
//     auth_token
//   } = responseData;

//   if (auth_token) {
//     localStorage.setItem("token", auth_token);
//     console.log("Успешная аутентификация!");
//   } else {
//     throw new Error("Отсутствует токен аутентификации");
//   }
// }

async function doLogin() {
  try {
    await login("root@gmail.com", "root");
  } catch (error) {
    console.error("Ошибка аутентификации:", error);
  }
}

function createMenu() {
  console.log("createMenu____");
  // $(".header_global").remove();

  const createElement = (tagName, className) => {
    const element = document.createElement(tagName);
    element.classList.add(className);
    // const element = $("<" + tagName + ">").addClass(className);
    return element;
  };
  const TOKEN = localStorage.getItem("token") || "";
  const menuOpened = sessionStorage.getItem("menuOpened");
  // const header = createElement("header", "header_global");
  const header = document.createElement("header");
  header.classList.add("header_global");
  console.log("header______________________", header);

  const global = document.querySelector("#global .flex.h-full.max-w-full.flex-1.flex-col");

  if (menuOpened == "true") {
    console.log("global_add_active");
    global.classList.add("active");
    header && header?.classList.add("active");
  } else {
    console.log("global_remove_active");
    header && header?.classList.remove("active");
    global.classList.remove("active");
  }

  const menuContent = document.querySelector(".menu_content");

  if (TOKEN && !menuOpened) {
    console.log("SET_GLOCBAL");
    // global.classList.add("active");
    header && header?.classList.add("active");
    menuContent && menuContent?.classList.add("active");
  }
  const account = createElement("div", "account");
  const accountUser = createElement("div", "user");
  const accountSettings = createElement("div", "settings");
  const settingsMenuLink = createElement("a", "menu");
  const settingsMenuImg = createElement("img");
  settingsMenuImg.src = chrome.runtime.getURL("assets/images/right_sidebar_icon.svg");
  settingsMenuImg.alt = "";

  account.append(accountUser);
  settingsMenuLink.append(settingsMenuImg);
  accountSettings.append(settingsMenuLink);
  header.append(accountSettings);
  header.append(account);
  // const el = document.querySelector("main  div.flex-1.overflow-hidden");

  // console.log("el____====", el);
  // el.append(header);
  const isHeader = document.querySelector(".header_global");
  console.log("isHeader", isHeader);
  if (!isHeader) {
    $("#__next main div.flex-1.overflow-hidden ").append(header);
  }

  // $(
  //   "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main  div.flex-1.overflow-hidden "
  // ).css("padding-top", "60px");

  $(settingsMenuLink)
    .off("click")
    .on("click", async () => {
      console.log("Клик по settingsMenuLink");
      const $element = $(".menu");
      const isOpenedMenu = $element.hasClass("active");

      if (!isOpenedMenu) {
        console.log("Сайдбар был закрыт, открываем его");
        $(".menu_content").addClass("active");
        $(".flex.h-full.max-w-full.flex-1.flex-col").addClass("active");
        $(".header_global").addClass("active");
        $(".flex h-full max-w-full flex-1.flex-col").addClass("active");
        sessionStorage.setItem("menuOpened", true);
        // headerWasActive = true;
        try {
          await getCategories();
        } catch (error) {
          console.error(error);
        }
        // menuOpened = true;
      } else {
        console.log("Сайдбар был открыт, закрываем его");
        $(".menu_content").removeClass("active");
        $(".flex.h-full.max-w-full.flex-1.flex-col").removeClass("active");
        $(".header_global").removeClass("active");
        $(".flex h-full max-w-full flex-1 flex-col").removeClass("active");
        sessionStorage.setItem("menuOpened", false);
        // headerWasActive = false;
        // menuOpened = false;
      }
    });
}

setInterval(() => {
  const headerElement = $("#__next main div.flex-1.overflow-hidden").find(".header_global");

  if (headerElement.length === 0) {
    createMenu();
    headerStatus = null;
  } else {
    const currentStatus = headerElement.hasClass("active") ? "active" : "inactive";
    if (headerStatus !== currentStatus) {
      if (headerWasActive && currentStatus === "inactive") {
        headerElement.addClass("active");
      }
      headerStatus = currentStatus;
    }
  }
}, 500);

// async function initializeApp() {
//   try {
//     await doLogin();
//     createMenu();
//   } catch (error) {
//     console.error("Ошибка при инициализации приложения:", error);
//   }
// }

// initializeApp();
