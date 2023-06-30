let headerStatus = null;

let headerWasActive = false;

let menuOpened = false;

async function login(email, password) {
  const response = await fetch("https://gotgood.ai/api/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password
    }),
    redirect: 'follow'
  });

  const responseData = await response.json();
  const {
    auth_token
  } = responseData;

  if (auth_token) {
    localStorage.setItem("token", auth_token);
    console.log("Успешная аутентификация!");
  } else {
    throw new Error("Отсутствует токен аутентификации");
  }
}

async function doLogin() {
  try {
    await login("root@gmail.com", "root");
  } catch (error) {
    console.error("Ошибка аутентификации:", error);
  }
}





function createMenu() {
  $('.header_global').remove();

  const createElement = (tagName, className) => {
    const element = $("<" + tagName + ">").addClass(className);
    return element;
  };

  const header = createElement("header", "header_global");
  const account = createElement("div", "account");
  const accountUser = createElement("div", "user");
  const accountSettings = createElement("div", "settings");
  const settingsMenuLink = createElement("a", "menu");
  const settingsMenuImg = createElement("img");
  settingsMenuImg.attr("src", chrome.runtime.getURL('assets/images/menu.svg'));
  settingsMenuImg.attr("alt", "");


  account.append(accountUser);
  settingsMenuLink.append(settingsMenuImg);
  accountSettings.append(settingsMenuLink);
  header.append(accountSettings);
  header.append(account);
  $("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden ").append(header);
  $("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden ").css('padding-top', '60px');

  settingsMenuLink.off('click').on("click", async () => {
    console.log("Клик по settingsMenuLink");
    const $element = $('.menu');
    const isOpenedMenu = $element.hasClass('active');
    

    if (!isOpenedMenu) {
      console.log("Сайдбар был закрыт, открываем его");
      $(".menu_content").addClass("active");
      $(".flex.h-full.max-w-full.flex-1.flex-col").addClass("active");
      $(".header_global").addClass("active");
      $(".flex h-full max-w-full flex-1.flex-col").addClass("active");
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
      // headerWasActive = false;
      // menuOpened = false;
    }
  })

};





setInterval(() => {
  const headerElement = $("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden").find('.header_global');

  if (headerElement.length === 0) {
    createMenu();
    headerStatus = null;
  } else {

    const currentStatus = headerElement.hasClass('active') ? 'active' : 'inactive';
    if (headerStatus !== currentStatus) {

      if (headerWasActive && currentStatus === 'inactive') {
        headerElement.addClass('active');
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