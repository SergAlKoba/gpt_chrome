const API_URL = "https://gotgood.ai";
const TOKEN = localStorage.getItem("token") || "";

// Utils functions and global state

let isLoading = false;
let selectedCategoryId = undefined;
let selectedSort = undefined;
let searchValue = undefined;
const observers = [];

const listSortMenu = [
  { text: "Most Liked", id: 1 },
  { text: "Most Viewed", id: 2 },
  { text: "Date", id: 3 },
];

const defaultCategoryNameEnum = {
  FAVORITE: "Favorite prompts",
  CUSTOM: "Custom prompts",
};

const defaultCategoryIdEnum = {
  FAVORITE: 0,
  CUSTOM: 100,
};

const categoryFavoriteId = 0;

const defaultCategory = [
  {
    id: defaultCategoryIdEnum.FAVORITE,
    name: defaultCategoryNameEnum.FAVORITE,
    icon: null,
    color: null,
    isAccess: true,
  },
  { id: defaultCategoryIdEnum.CUSTOM, name: defaultCategoryNameEnum.CUSTOM, icon: null, color: null, isAccess: true },
];

function addObserver(callback) {
  observers.push(callback);
}

function setIsLoading(value) {
  isLoading = value;
  observers.forEach((callback) => {
    callback(isLoading);
  });
}

function getUserSubscriptionTier() {
  const subscriptionTier = sessionStorage.getItem("subscription_tier");
  if (subscriptionTier === null || subscriptionTier === "0") return "free";
  if (subscriptionTier === "1") return "tier1";
  if (subscriptionTier === "2") return "tier2";
  if (subscriptionTier === "3") return "tier3";
}

addObserver(function (isLoading) {
  const loaderWrapper = document.querySelector(".loader-wrapper");
  if (isLoading) {
    loaderWrapper && (loaderWrapper.style.display = "flex");
  } else {
    loaderWrapper && (loaderWrapper.style.display = "none");
  }
});

function debounce(func, delay) {
  let timeoutId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

function formatNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else {
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixIndex = Math.floor(Math.log10(number) / 3);
    const scaledNumber = (number / Math.pow(1000, suffixIndex)).toFixed(1);

    return scaledNumber + suffixes[suffixIndex];
  }
}

function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  let clone;

  if (Array.isArray(obj)) {
    clone = [];
    for (let i = 0; i < obj.length; i++) {
      clone[i] = deepClone(obj[i]);
    }
  } else {
    clone = {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
  }

  return clone;
}

function replaceVariables(data, text) {
  for (let i = 0; i < data.length; i++) {
    const variableName = data[i].variable_name;
    const value = data[i].value;
    const regex = new RegExp(`\\[${variableName}\\]`, "g");
    text = text.replace(regex, value);
  }
  return text;
}

function normalizeString(string) {
  return string.replace(/\s+/g, " ").trim();
}

async function searchPrompts(text, categoryId, sort) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `token ${localStorage.getItem("token")}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  setIsLoading(true);

  const categoriesUseFavoriteRoute = [defaultCategoryIdEnum.FAVORITE];

  if (categoryId === defaultCategoryIdEnum.CUSTOM) {
    let response = await fetch(
      API_URL + `/api/shop/get-custom-user-prompts/?text=${text}&sort=${sort}`,
      requestOptions
    );
    setIsLoading(false);

    return await response.json();
  } else {
    let response = await fetch(
      API_URL +
        `/api/shop/search/?text=${text}&${
          categoriesUseFavoriteRoute.includes(categoryId) ? "favorite=true" : `categories=${categoryId}`
        }&sort=${sort}`,
      requestOptions
    );
    setIsLoading(false);

    return await response.json();
  }
}

async function getCategories() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  setIsLoading(true);
  let response = await fetch(API_URL + "/api/shop/get-categories/", requestOptions);
  setIsLoading(false);
  let result = await response.json();
  sessionStorage.setItem("categories", JSON.stringify(result.results));
  return result;
}

async function getFavorites() {
  try {
    var myHeaders = new Headers();
    var token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }
    myHeaders.append("Authorization", `token ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let response = await fetch(API_URL + "/api/chat/get-favorites/", requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let result = await response.json();

    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

// Render functions
async function getPromptsByCategory(categoryId) {
  const TOKEN = localStorage.getItem("token") || "";
  try {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/api/shop/get-extension-prompt-by-category/${categoryId}`, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    setIsLoading(false);
    if (!response.ok) {
      throw new Error("Failed to fetch prompts by category.");
    }
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getFavoritesCategory() {
  const TOKEN = localStorage.getItem("token") || "";
  try {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/api/user/favorites`, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    setIsLoading(false);
    if (!response.ok) {
      throw new Error("Failed to fetch prompts by category.");
    }
    const result = await response.json();

    return result?.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getCustomsCategory() {
  const TOKEN = localStorage.getItem("token") || "";
  try {
    setIsLoading(true);

    const response = await fetch(API_URL + `/api/shop/get-custom-user-prompts/`, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    setIsLoading(false);
    if (!response.ok) {
      throw new Error("Failed to fetch prompts by category.");
    }
    const result = await response.json();

    return result?.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const regex = /{([^}]+)}/g;

function preventSubmission(event) {
  event.preventDefault();
}

function sendInput(selected_prompt, is_disabled = false) {
  let send_button = document.querySelector("form > div > div > button");
  let textarea = document.querySelector("textarea");
  textarea.value = selected_prompt;

  // Create and dispatch the input event
  let event = new Event("input", {
    bubbles: true,
    cancelable: true,
  });
  textarea.dispatchEvent(event);

  // If the button is initially disabled, remove the disabled attribute
  if (is_disabled) {
    send_button.removeAttribute("disabled");
  }

  send_button.click();
}

function processInput() {
  console.log("processInput___");
  let input = document.querySelector("input[type='search']");
  let variable_names = input.value.split(",");
  let send_button = document.querySelector("form > div > button");

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const inputValue = input.value.trim();
      if (localStorage.getItem("template") && inputValue !== "") {
        let variables = input.value.split(",");
        let selected_prompt = localStorage.getItem("template");
        for (let i = 0; i < variable_names.length; i++) {
          selected_prompt = selected_prompt.replace(/{.*}/, variables[i]);
        }

        input.value = selected_prompt;
        localStorage.removeItem("template");
        input.value = "";
        input.placeholder = "Send a message.";
      }
    } else {
      input.addEventListener("submit", preventSubmission);
    }
    input.placeholder = "Send a message.";
  });
}

function filterCategory(categoryName) {
  const allCategories = document.querySelectorAll(".categories .items");
  allCategories.forEach((category) => {
    if (categoryName === "all" || category.querySelector("li").innerText.trim() === categoryName) {
      category.style.display = "block";
    } else {
      category.style.display = "none";
    }
  });
}

function searchItems(searchValue) {
  const allItems = document.querySelectorAll(".story_content_liner div");
  allItems.forEach((item) => {
    if (item.querySelector("p").innerText.toLowerCase().includes(searchValue.toLowerCase())) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function createLoader() {
  const loader = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/loader.gif"),
    },
    []
  );

  return createElem(
    "div",
    {
      class: "loader-wrapper",
    },
    [loader]
  );
}

function createCategory(id) {
  const categoryItems = createElem(
    "ul",
    {
      class: "items",
    },
    []
  );

  getPromptsByCategory(id)
    .then((response) => {
      console.log("getPromptsByCategory_________-1111");
      for (let i = 0; i < response.length; i++) {
        const promptParagraph = createElem("p", {}, [response[i].prompt_template]);
        const promptDiv = createElem(
          "div",
          {
            id: response[i].id,
            class: "answer",
          },
          [promptParagraph]
        );
        promptDiv.addEventListener("click", () => {
          const selected_prompt = response[i].prompt_template;
          const matches = selected_prompt.match(regex);
          console.warn(matches);
          if (matches) {
            const variables = matches.map((match) => `[${match.substring(1, match.length - 1)}]`);
            const variable_without_braces = matches.map((match) => match.substring(1, match.length - 1));
            document.querySelector("input[type='search']").setAttribute("placeholder", variables);
            variable_names = variable_without_braces;
            localStorage.setItem("template", response[i].prompt_template);
            processInput();
          } else {
            localStorage.setItem("template", selected_prompt);
            sendInput(selected_prompt, true);
          }
        });

        categoryItems.appendChild(promptDiv);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return categoryItems;
}

function createMenuButton() {
  const menuButton = createElem(
    "a",
    {
      class: "menu",
    },
    [
      createElem(
        "img",
        {
          src: chrome.runtime.getURL("assets/images/menu.svg"),
        },
        []
      ),
    ]
  );

  menuButton.addEventListener("click", () => {
    const menuContent = document.querySelector(".menu_content");
    const headerGlobal = document.querySelector(".header_global");
    const global = document.querySelector("#global .flex.h-full.max-w-full.flex-1.flex-col");

    menuContent.classList.remove("active");
    headerGlobal.classList.remove("active");
    global.classList.remove("active");
  });

  return menuButton;
}

async function createMenuContent() {
  const menuButton = createMenuButton();

  const menuContent = createElem(
    "div",
    {
      class: "menu_content",
    },
    [
      createElem("div", {}, [
        menuButton,
        createElem("h2", {}, ["Prompt bar"]),
        createRegistration(),
        await createPromptBar(),
      ]),
    ]
  );

  return menuContent;
}

async function createSignedMenuContent() {
  const menuButton = createMenuButton();

  const menuContent = createElem(
    "div",
    {
      class: "menu_content",
    },
    [createElem("div", {}, [menuButton, createElem("h2", {}, ["Prompt bar"]), await createPromptBar()])]
  );

  return menuContent;
}

function createRegistration() {
  const signUpLink = createElem(
    "a",
    {
      class: "sign_up sign_up_js",
      href: "javascript:void(0)",
    },
    ["Sign Up"]
  );

  signUpLink.addEventListener("click", () => {
    $(".popup").removeClass("active");
    $(".sign_up_popup").addClass("active");
  });

  const orText = createElem("span", {}, ["or"]);

  const signInLink = createElem(
    "a",
    {
      class: "sign_in sign_in_js",
      href: "javascript:void(0)",
    },
    ["Sign In"]
  );

  signInLink.addEventListener("click", () => {
    $(".popup").removeClass("active");
    $(".sign_in_popup").addClass("active");
  });

  const registration = createElem(
    "div",
    {
      class: "registration active",
    },
    [signUpLink, orText, signInLink]
  );

  return registration;
}

function createSortBtn() {
  // const sortIcon = createElem(
  //   "img",
  //   {
  //     src: chrome.runtime.getURL("assets/images/sortIcon.svg"),
  //   },
  //   []
  // );

  const wrapperSortIcon = createElem("div", { class: "wrapper_sort_icon" }, []);
  return wrapperSortIcon;
}

function rerenderSortMenuByNewList(list = []) {
  const wrapperFormAndSortBtn = document.querySelector(`.wrapper_form_and_sort_btn`);

  const sort_menu = wrapperFormAndSortBtn.querySelector(".sort_menu");
  if (sort_menu) sort_menu.remove();

  const sortMenuList = createSortMenuList(list);
  wrapperFormAndSortBtn.appendChild(sortMenuList);
}

function createSortMenuList(listSortMenu) {
  const sortMenuList = createElem(
    "ul",
    {
      class: "sort_menu",
    },
    []
  );

  listSortMenu.forEach((item) => {
    const isActive = item?.id === selectedSort;
    const sortMenuListItem = createElem(
      "li",
      {
        class: isActive ? "sort_menu_item active" : "sort_menu_item",
      },
      [item.text]
    );

    sortMenuListItem.addEventListener("click", async () => {
      selectedSort = item?.id;

      let sortMenuItemActive = document.querySelector(".sort_menu_item.active");
      if (sortMenuItemActive) sortMenuItemActive.classList.remove("active");

      sortMenuList.classList.toggle("active");
      sortMenuListItem.classList.toggle("active");
      const playgroundCategoryId = 4;
      const promptsResult = await searchPrompts(
        searchValue || "",
        selectedCategoryId ?? playgroundCategoryId,
        selectedSort
      );

      const promptBarContentList = document.querySelector(".drop_content.list");
      const promptBarContentGrid = document.querySelector(".drop_content.grid");

      createPrompts(promptsResult?.results || [], promptBarContentList, ".drop_content.list");
      createPrompts(promptsResult?.results || [], promptBarContentGrid, ".drop_content.grid");
    });

    sortMenuList.appendChild(sortMenuListItem);
  });

  return sortMenuList;
}

function createSingleSearchPrompt(promptObj, searchValue) {
  let wrapperSearchPrompt = createElem("div", { class: "search_propmt_item" }, []);

  let categories = createElem(
    "div",
    {
      class: "designation",
    },
    []
  );

  promptObj.categories.forEach((categoryObj) => {
    let category = createElem("div", { class: "badge_search" }, []);

    const categorySpan = document.createElement("div");
    categorySpan.textContent = categoryObj?.name;
    category.appendChild(categorySpan);
    category.style.marginRight = "10px";

    categories.appendChild(category);
  });

  let title = createElem("h3", {}, []);

  const regex = new RegExp(searchValue, "gi");
  const titleWithSelectedSearchWord = promptObj?.name.replace(
    regex,
    (match) => `<span class="selected_search_value">${match}</span>`
  );

  const descriptionWithSelectedSearchWord = promptObj?.description.replace(
    regex,
    (match) => `<span class="selected_search_value">${match}</span>`
  );

  title.innerHTML = titleWithSelectedSearchWord;
  let description = createElem("p", {}, []);
  description.innerHTML = descriptionWithSelectedSearchWord;

  wrapperSearchPrompt.appendChild(categories);
  wrapperSearchPrompt.appendChild(title);
  wrapperSearchPrompt.appendChild(description);

  return wrapperSearchPrompt;
}

async function processInput(e) {
  const promptsResult = await searchPrompts(e.target.value, selectedCategoryId ?? 1, selectedSort || 1);
  const prompts = promptsResult?.results || [];
  searchValue = e.target.value;

  const wrapperFormAndSortBtn = document.querySelector(".wrapper_form_and_sort_btn");
  if (searchValue.trim() === "") {
    const searchWrapper = wrapperFormAndSortBtn.querySelector(".search_wrapper");
    if (searchWrapper) searchWrapper.remove();
    return;
  }

  const searchWrapper = wrapperFormAndSortBtn.querySelector(".search_wrapper") || document.createElement("div");
  searchWrapper.classList.add("search_wrapper");
  const isEmptyData = prompts.length === 0;

  while (searchWrapper.firstChild) {
    searchWrapper.removeChild(searchWrapper.firstChild);
  }

  if (isEmptyData) {
    const emptyDataBlock = document.createElement("div");
    emptyDataBlock.classList.add("is_empty_data");
    emptyDataBlock.textContent = "No results found";
    searchWrapper.appendChild(emptyDataBlock);
    wrapperFormAndSortBtn.appendChild(searchWrapper);
    return;
  }

  const searchList = document.createElement("ul");

  searchList.classList.add("search_list");

  const onShowPromptPopupById = (prompt) => () => {
    document.body.appendChild(createPromptDetailsPopup(prompt));
  };

  for (let i = 0; i < prompts?.length; i++) {
    let prompt = createSingleSearchPrompt(prompts[i], searchValue);
    prompt.addEventListener("click", () => {
      onShowPromptPopupById(prompts[i])();
    });

    searchList.appendChild(prompt);
  }

  searchWrapper.appendChild(searchList);
  wrapperFormAndSortBtn.appendChild(searchWrapper);

  // const promptBarContentList = document.querySelector(".drop_content.list");
  // const promptBarContentGrid = document.querySelector(".drop_content.grid");

  // createPrompts(promptsResult?.results || [], promptBarContentList, ".drop_content.list");
  // createPrompts(promptsResult?.results || [], promptBarContentGrid, ".drop_content.grid");
}

function createSearch() {
  const searchInput = createElem(
    "input",
    {
      type: "search",
      id: "search",
      placeholder: "Search",
    },
    []
  );

  const debouncedProcessInput = debounce(processInput, 500);

  searchInput.addEventListener("input", debouncedProcessInput);

  let searchIcon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/search.svg"),
    },
    []
  );

  let searchButton = createElem("button", {}, [searchIcon]);

  const form = createElem("form", {}, [searchButton, searchInput]);

  const sortBtn = createSortBtn();
  const sortIcon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/sortIcon.svg"),
    },
    []
  );
  sortBtn.appendChild(sortIcon);
  const sortMenuList = createSortMenuList(listSortMenu);
  const wrapperFormAndSortBtn = createElem("div", { class: "wrapper_form_and_sort_btn" }, [
    form,
    sortBtn,
    sortMenuList,
  ]);

  // start get body and if  i click not sortBtn and not sortMenuList and not sortIcon then remove class active

  const body = document.querySelector("body");
  body.addEventListener("click", (e) => {
    const sortMenuList = document.querySelector(".sort_menu");
    if (e.target !== sortBtn && e.target !== sortMenuList && e.target !== sortIcon) {
      sortMenuList.classList.remove("active");
    }
  });

  //end  get body and if  i click not sortBtn and not sortMenuList and not sortIcon then remove class active

  sortBtn.addEventListener("click", () => {
    const sortMenuList = document.querySelector(".sort_menu");
    console.log("sortMenuList", sortMenuList);
    sortMenuList.classList.toggle("active");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  return wrapperFormAndSortBtn;
}

function createCategoryMenu(categories) {
  const categoryPlayground = categories.find((item) => item.name === "Playground");
  const isValidImg = !!categoryPlayground?.icon;

  let filterImage = createElem(
    "img",
    {
      src: categoryPlayground?.icon,
    },
    []
  );

  let filterText = createElem(
    "span",
    {
      data: categoryPlayground?.id,
    },
    []
  );

  filterText.textContent = categoryPlayground?.name;
  const childrenFilterTitle = isValidImg ? [filterImage, filterText] : [filterText];

  let filterTitle = createElem(
    "div",
    {
      class: "filter_title",
    },
    childrenFilterTitle
  );

  let filterDrop = createElem(
    "ul",
    {
      class: "filter_drop",
    },
    []
  );

  let intervalId = setInterval(() => {
    let body = document.querySelector("body");

    const isSubscriptionTierLoaded = body.classList.contains("subscription_tier_loaded");

    if (isSubscriptionTierLoaded) {
      const subscriptionTier = getUserSubscriptionTier();

      const categoriesForSubscriptionTierFree = ["Playground"];
      const changeIsAccessCategory = (isAccessArr) => (category) =>
        isAccessArr.includes(category.name) ? { ...category, isAccess: true } : { ...category, isAccess: false };
      const categoriesBySubscriptionTierFree = categories.map(
        changeIsAccessCategory(categoriesForSubscriptionTierFree)
      );

      const getCategoriesBySubscriptionTier = {
        free: categoriesBySubscriptionTierFree,
        tier1: categories,
        tier2: categories,
        tier3: categories,
      };

      const categoriesBySubscriptionTier = getCategoriesBySubscriptionTier[subscriptionTier];
      for (let i = 0; i < categoriesBySubscriptionTier.length; i++) {
        const category = categoriesBySubscriptionTier[i];
        let filterDropItem = createElem(
          "li",
          {
            // data: category?.id,
            class: "filter_drop_item",
          },
          []
        );

        const proCategoryArr = [defaultCategoryNameEnum.FAVORITE, defaultCategoryNameEnum.CUSTOM];
        const isProCategory = proCategoryArr.includes(category?.name);
        const isSubscriptionTierFree = subscriptionTier === "free";

        filterDropItem.addEventListener("click", async (e) => {
          if (isProCategory && isSubscriptionTierFree) {
            const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
            document.body.appendChild(upgradeSubscriptionPopup);
            return;
          }

          const categoryId = category?.id;
          selectedCategoryId = categoryId;

          let promptsResponse = await searchPrompts(
            searchValue || "",
            selectedCategoryId ?? playgroundCategoryId,
            selectedSort ?? 1
          );

          // promptsResponse = await getCustomsCategory();

          if (categoryId === defaultCategoryIdEnum.CUSTOM) {
            const listSortMenuByCustomsCategory = [{ text: "Date", id: 3 }];
            rerenderSortMenuByNewList(listSortMenuByCustomsCategory);
          } else {
            // promptsResponse = await getPromptsByCategory(categoryId);
            rerenderSortMenuByNewList(listSortMenu);
          }

          const { name: newTitleName } = categoriesBySubscriptionTier.find(({ id }) => id === categoryId);
          document.querySelector(".filter_title span").textContent = newTitleName;

          const promptBarContentList = document.querySelector(".drop_content.list");
          const promptBarContentGrid = document.querySelector(".drop_content.grid");

          createPrompts(promptsResponse?.results, promptBarContentList, ".drop_content.list");
          createPrompts(promptsResponse?.results, promptBarContentGrid, ".drop_content.grid");
        });

        const spanName = createElem("span", {}, [category?.name]);
        const spanProCategory = createElem("div", { class: "pro_category" }, ["PRO"]);
        filterDropItem.appendChild(spanName);

        if (isProCategory) {
          filterDropItem.appendChild(spanProCategory);
          spanProCategory.classList.add("pro_category");
          if (isSubscriptionTierFree) {
            spanProCategory.classList.add("no_access_pro_category");
          }
        }

        // if (!category.isAccess) {
        //   filterDropItem.classList.add("no_access_dropdown_item_category");
        // }

        filterDrop.appendChild(filterDropItem);
      }

      clearInterval(intervalId);
    }
  }, 1000);

  let filterElem = createElem(
    "div",
    {
      class: "filter_content",
    },
    [filterTitle, filterDrop]
  );

  const img1 = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/unordered-list.svg"),
      alt: "",
    },
    []
  );

  const img2 = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/grid.svg"),
      alt: "",
    },
    []
  );

  const link1 = createElem(
    "a",
    {
      "data-view": "list",
      href: "javascript:void(0)",
      class: "view_item active",
    },
    [img1]
  );

  link1.addEventListener("click", (e) => {
    link1.classList.add("active");
    link2.classList.remove("active");
    const dropContentList = document.querySelector(".drop_content.list");

    dropContentList.classList.add("active");
    const dropContentGrid = document.querySelector(".drop_content.grid");
    dropContentGrid.classList.remove("active");
  });

  const link2 = createElem(
    "a",
    {
      "data-view": "grid",
      href: "javascript:void(0)",
      class: "view_item",
    },
    [img2]
  );

  link2.addEventListener("click", (e) => {
    link2.classList.add("active");
    link1.classList.remove("active");
    const dropContentList = document.querySelector(".drop_content.list");
    dropContentList.classList.remove("active");
    const dropContentGrid = document.querySelector(".drop_content.grid");
    dropContentGrid.classList.add("active");
  });

  const filterView = createElem("div", { class: "filter_view" }, [link1, link2]);

  let filterWrapper = createElem(
    "div",
    {
      class: "filter",
    },
    [filterElem, filterView]
  );

  return filterWrapper;
}

function createSinglePrompt(promptObj) {
  let link = createElem(
    "a",
    {
      href: "javascript:void(0)",
      class: "prompt_popup_js",
    },
    []
  );
  let categories = createElem(
    "div",
    {
      class: "designation",
    },
    []
  );

  promptObj.categories.forEach((categoryObj) => {
    const isHasColor = !!categoryObj?.color;
    let category = null;
    let svg = null;

    if (isHasColor) {
      const color = categoryObj?.color;
      category = createElem("div", { class: "badge", style: `background-color: ${color}; color: ${color};` }, []);
      svg = `<svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.16655 7.33268C9.16655 9.99935 7.33325 10.8327 4.99988 10.8327C2.33325 10.8327 0.833252 8.93268 0.833252 7.33268C0.833252 5.73268 1.66659 4.27713 2.33325 3.83268C2.33325 5.69935 4.111 6.88824 4.99988 6.83268C3.39988 4.43268 4.77766 1.77713 5.66655 1.16602C5.66655 4.16602 9.16655 4.66602 9.16655 7.33268Z" stroke="#5FE9D0" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `;
    } else {
      category = createElem(
        "div",
        { class: "badge", style: `background-color: rgba(185, 159, 21, 0.1); color: #b99f15;` },
        []
      );
    }

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "10");
    svgElement.setAttribute("height", "12");
    svgElement.setAttribute("viewBox", "0 0 10 12");
    svgElement.setAttribute("fill", "none");

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute(
      "d",
      "M9.16655 7.33268C9.16655 9.99935 7.33325 10.8327 4.99988 10.8327C2.33325 10.8327 0.833252 8.93268 0.833252 7.33268C0.833252 5.73268 1.66659 4.27713 2.33325 3.83268C2.33325 5.69935 4.111 6.88824 4.99988 6.83268C3.39988 4.43268 4.77766 1.77713 5.66655 1.16602C5.66655 4.16602 9.16655 4.66602 9.16655 7.33268Z"
    );
    pathElement.setAttribute("stroke", "#b99f15");
    pathElement.setAttribute("stroke-linecap", "round");
    pathElement.setAttribute("stroke-linejoin", "round");
    svgElement.appendChild(pathElement);

    const svgWrapper = document.createElement("div");
    svgWrapper.appendChild(svgElement);

    category.appendChild(svgWrapper);

    const categoryIsHasParent = !!categoryObj?.parent;

    if (categoryIsHasParent) {
      const categorySpan = document.createElement("div");
      categorySpan.textContent = categoryObj?.parent;
      category.appendChild(categorySpan);

      const subCategory = createElem("div", { class: "badge_subcategory" }, []);
      subCategory.textContent = categoryObj?.name;
      category.appendChild(subCategory);
    } else {
      const categorySpan = document.createElement("div");
      categorySpan.textContent = categoryObj?.name;
      category.appendChild(categorySpan);
      category.style.marginRight = "10px";
    }

    categories.appendChild(category);
  });

  let title = createElem("h3", {}, []);
  title.textContent = promptObj.name;
  let description = createElem("p", {}, []);
  description.textContent = promptObj.description;

  let pointBackgroundColor =
    promptObj?.categories && promptObj?.categories[0]?.color
      ? "background-color: " + promptObj?.categories[0]?.color
      : "background-color: rgba(185, 159, 21, 1);";

  let point = createElem(
    "span",
    {
      class: "point",
      style: pointBackgroundColor,
    },
    []
  );

  let viewIcon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/eye.svg"),
    },
    []
  );

  let viewP = createElem(
    "p",
    {
      style: "margin: unset;",
    },
    []
  );

  viewP.textContent += " " + promptObj.amount_of_lookups;

  let views = createElem("li", {}, [viewIcon, viewP]);

  let likeIcon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/thumbs-up.svg"),
    },
    []
  );

  let likeP = createElem(
    "p",
    {
      style: "margin: unset;",
    },
    []
  );

  likeP.textContent += " " + promptObj.like_amount;

  let likes = createElem("li", {}, [likeIcon, likeP]);

  let stats = createElem(
    "ul",
    {
      class: "stats",
    },
    [likes, views]
  );

  return createElem(
    "div",
    {
      class: "answer",
    },
    [link, categories, title, description, stats, point]
  );
}

async function createPromptBar() {
  const categoriesResponse = await getCategories();
  const categoriesWithIsAccessProperty = categoriesResponse?.results.map((category) => ({
    ...category,
    isAccess: true,
  }));

  const categories = [...defaultCategory, ...categoriesWithIsAccessProperty] || defaultCategory;

  const categoryPlaygroundId = categoriesResponse?.results.find((category) => category.name === "Playground")?.id;

  const promptsResponse = await getPromptsByCategory(categoryPlaygroundId);

  let promptBarContent = createElem(
    "div",
    {
      class: "drop_content list active",
    },
    []
  );

  let promptBarContentGrid = createElem(
    "div",
    {
      class: "drop_content grid",
    },
    []
  );

  createPrompts(promptsResponse, promptBarContent, ".drop_content.list");
  createPrompts(promptsResponse, promptBarContentGrid, ".drop_content.grid");

  let promptItemContent = createElem(
    "div",
    {
      class: "promt_item_content",
    },
    [promptBarContent, promptBarContentGrid]
  );

  let promptsCategoriesDiv = createElem(
    "div",
    {
      class: "categories promt_item active",
    },
    [createCategoryMenu(categories), promptItemContent]
  );

  let promptBar = createElem(
    "div",
    {
      class: "promt_bar",
    },
    [createSearch(), promptsCategoriesDiv]
  );
  return promptBar;
}

function createPrompts(prompts, parent, parentClass = ".drop_content.list") {
  const promptsWrapper = document.querySelector(parentClass) || parent;

  // const promptsWrapperGrid = document.querySelector('.drop_content.grid') || parent;

  while (promptsWrapper.firstChild) {
    promptsWrapper.removeChild(promptsWrapper.firstChild);
  }

  const onShowPromptPopupById = (prompt) => () => {
    document.body.appendChild(createPromptDetailsPopup(prompt));
  };

  for (let i = 0; i < prompts.length; i++) {
    let prompt = createSinglePrompt(prompts[i]);
    const promptId = prompts[i].id;

    prompt.addEventListener("click", () => {
      onShowPromptPopupById(prompts[i])();
    });

    promptsWrapper.appendChild(prompt);
  }
}

function createPromptDetailsPopup({
  name,
  description,
  amount_of_lookups,
  like_amount,
  inputs,
  prompt_template,
  categories,
  is_liked,
  is_favourite,
  id,
}) {
  console.log("createPromptDetailsPopup_______");
  const modalState = deepClone(inputs); // [{variable_name: "variable2", placeholder: "variable2", value: "some value"}] as example

  const popup = document.createElement("div");
  popup.classList.add("popup", "prompt_details_popup", "active");

  const closeSpan = document.createElement("span");
  closeSpan.classList.add("close");
  popup.appendChild(closeSpan);

  closeSpan.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup_content");
  popup.appendChild(popupContent);

  const closePopupSpan = document.createElement("span");
  closePopupSpan.classList.add("close_popup");
  popupContent.appendChild(closePopupSpan);

  const closeImg = document.createElement("img");
  closeImg.src = chrome.runtime.getURL("assets/images/close.svg");
  closeImg.alt = "";

  closeImg.addEventListener("click", () => {
    document.body.removeChild(popup);
  });

  closePopupSpan.appendChild(closeImg);

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  popupContent.appendChild(titleDiv);

  const titleHeading = document.createElement("h5");
  titleHeading.textContent = "Prompt details";
  titleDiv.appendChild(titleHeading);

  const promptPopupContentDiv = document.createElement("div");
  promptPopupContentDiv.classList.add("prompt_popup_content");
  popupContent.appendChild(promptPopupContentDiv);

  const tabPromptContentDiv = document.createElement("div");
  tabPromptContentDiv.classList.add("tab_prompt_content");
  promptPopupContentDiv.appendChild(tabPromptContentDiv);

  const answerDiv = document.createElement("div");
  answerDiv.classList.add("answer");
  tabPromptContentDiv.appendChild(answerDiv);

  const categoriesUl = document.createElement("ul");
  categoriesUl.classList.add("prompt_categories");

  categories.forEach((category) => {
    const categoryLi = document.createElement("li");
    categoryLi.classList.add("prompt_category");

    const categoryIcon = document.createElement("img");
    categoryIcon.classList.add("category_icon");
    categoryIcon.src = chrome.runtime.getURL("assets/images/flames.svg");

    categoryIcon.alt = "category icon";
    categoryLi.appendChild(categoryIcon);

    const categorySpan = document.createElement("span");
    categorySpan.textContent = category?.name;
    categoryLi.appendChild(categorySpan);

    categoriesUl.appendChild(categoryLi);
  });

  answerDiv.appendChild(categoriesUl);

  const likeAndFavoriteBlock = createPromptAction({ is_liked, is_favourite, id, categories });

  answerDiv.appendChild(likeAndFavoriteBlock);

  const answerHeading = document.createElement("h3");
  answerHeading.textContent = name;
  answerDiv.appendChild(answerHeading);

  const answerPara1 = document.createElement("p");
  answerPara1.textContent = description;
  answerDiv.appendChild(answerPara1);

  const statsList = document.createElement("ul");
  statsList.classList.add("stats");
  answerDiv.appendChild(statsList);

  let likeIcon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/thumbs-up.svg"),
    },
    []
  );

  let likeP = createElem(
    "p",
    {
      style: "margin: unset;",
    },
    []
  );

  likeP.textContent += " " + like_amount;

  let likes = createElem("li", {}, [likeIcon, likeP]);

  const likeBlock = document.createElement("li");
  likeBlock.appendChild(likes);
  statsList.appendChild(likeBlock);

  let viewIcon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/eye.svg"),
    },
    []
  );

  let viewP = createElem(
    "p",
    {
      style: "margin: unset;",
    },
    []
  );

  viewP.textContent += " " + amount_of_lookups;

  let views = createElem("li", {}, [viewIcon, viewP]);

  const viewBlock = document.createElement("li");

  viewBlock.appendChild(views);
  statsList.appendChild(viewBlock);

  const contentTopicDiv = document.createElement("div");
  contentTopicDiv.classList.add("content_topic");
  promptPopupContentDiv.appendChild(contentTopicDiv);

  const form = document.createElement("form");

  form.addEventListener("submit", async (event) => {
    form.checkValidity();
    event.preventDefault();
  });

  contentTopicDiv.appendChild(form);

  function createInput(labelText, inputType, placeholder, onValueChange, inputValue) {
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("input");

    const inputLabel = document.createElement("label");
    inputLabel.textContent = labelText;
    inputDiv.appendChild(inputLabel);

    const input = document.createElement("input");
    input.type = inputType;
    input.placeholder = placeholder;
    input.required = true;
    input.value = null;
    input.name = labelText;
    input.addEventListener("input", onValueChange);
    inputDiv.appendChild(input);

    return inputDiv;
  }

  function createTextarea(labelText, placeholder, onValueChange) {
    const textareaDiv = document.createElement("div");
    textareaDiv.classList.add("input");

    const textareaLabel = document.createElement("label");
    textareaLabel.textContent = labelText;
    textareaDiv.appendChild(textareaLabel);

    const textarea = document.createElement("textarea");
    textarea.classList.add("prompt_detail_modal_textarea");
    textarea.placeholder = placeholder;
    textarea.required = true;
    textarea.value = null;
    textarea.name = labelText;
    textarea.addEventListener("input", onValueChange);
    textareaDiv.appendChild(textarea);

    return textareaDiv;
  }

  const handleInputValueChange = (e) => {
    const index = modalState.findIndex(({ variable_name }) => variable_name === e.target.name);
    modalState[index].value = e.target.value;
  };

  inputs.forEach(({ variable_name, placeholder, is_textarea }) => {
    if (is_textarea) {
      const textareaDiv = createTextarea(variable_name, placeholder, handleInputValueChange);
      form.appendChild(textareaDiv);
    } else {
      const inputDiv = createInput(variable_name, "text", placeholder, handleInputValueChange);
      form.appendChild(inputDiv);
    }
  });

  const bottomDiv = document.createElement("div");
  bottomDiv.classList.add("bottom");
  popupContent.appendChild(bottomDiv);

  const sendBtn = document.createElement("button");
  sendBtn.classList.add("use_prompt");
  sendBtn.textContent = "Send prompt";

  sendBtn.addEventListener("click", (e) => {
    const isValid = form.checkValidity();
    if (!isValid) {
      form.reportValidity();
    } else {
      document.body.removeChild(popup);
      sendInput(replaceVariables(modalState, prompt_template));

      const observer = new MutationObserver(() => {
        const checkElements = () => {
          const matches = [];
          const divElements = document.querySelectorAll(".break-words");

          const divCount = divElements.length;

          let count = divCount >= 5 ? divCount - 5 : 0;

          for (let i = count; i < divCount; i++) {
            const div = divElements[i];

            const childDiv = div.querySelector("div");
            let innerText = childDiv?.innerText ? childDiv?.innerText : "";

            innerText = innerText.replace(/\r\n|\r|\n/g, "\n");
            prompt_template = prompt_template.replace(/\r\n|\r|\n/g, "\n");

            const isEmptyModalState = modalState.length === 0;

            if (isEmptyModalState) {
              if (innerText == prompt_template) {
                div.parentNode.parentNode.parentNode.parentNode.style.display = "none";
              }
            } else if (innerText == replaceVariables(modalState, prompt_template)) {
              div.parentNode.parentNode.parentNode.parentNode.style.display = "none";
              // matches.push(div);
            }
          }

          // if (matches.some(div => div.getAttributeNames().length === 0)) {
          //   console.log('matches___in');
          //   const lastFiveItems = matches.slice(-5);
          //   lastFiveItems.forEach(div => {
          //     div.style.display = 'none';
          //   });
          // }
        };

        checkElements();
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Ideally, we need to clear MutationObserver instance after prompt is sent but chatgpt can show our prompt in the chat after some time
      // A lot of MutationObserver can be created, and it can cause performance issues
      // 1 prompt template message = 1 MutationObserver listener
    }
  });

  const subscriptionTier = getUserSubscriptionTier();
  const isPlaygroundCategory = categories.some((category) => category?.name === "Playground");

  if (subscriptionTier === "free") {
    if (isPlaygroundCategory) {
      bottomDiv.appendChild(sendBtn);
    }
  } else {
    bottomDiv.appendChild(sendBtn);
  }

  return popup;
}

function createPromptAction({ is_liked, is_favourite, id, categories }) {
  const like = createLikeBlock({ is_liked });

  let isLiked = is_liked;

  like.addEventListener("click", async function (e) {
    e.stopPropagation();

    const favoriteRequestObj = {
      prompt_id: id,
      like: !isLiked,
    };

    createLike(favoriteRequestObj);
    isLiked = !isLiked;

    if (like.classList.contains("active")) {
      like.classList.remove("active");
    } else {
      like.classList.add("active");
    }
  });

  const favorite = createFavoriteBlock({ is_favourite });

  let isFavorite = is_favourite;

  favorite.addEventListener("click", async function (e) {
    e.stopPropagation();

    const favoriteRequestObj = {
      prompt_id: id,
      favourite: !isFavorite,
    };

    createFavorite(favoriteRequestObj);

    isFavorite = !isFavorite;

    if (favorite.classList.contains("active")) {
      favorite.classList.remove("active");
    } else {
      favorite.classList.add("active");
    }
  });

  const subscriptionTier = getUserSubscriptionTier();

  let action;

  if (subscriptionTier === "free") {
    if (categories.some((category) => category?.name === "Playground")) {
      action = createElem("ul", { class: "selected" }, [like]);
    } else {
      action = createElem("ul", { class: "selected" }, []);
    }
  } else {
    action = createElem("ul", { class: "selected" }, [favorite, like]);
  }

  return action;
}

function createLikeBlock({ is_liked }) {
  const icon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/like.svg"),
    },
    []
  );

  let iconHover = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/like_hover.svg"),
      class: "hover",
    },
    []
  );

  let like = createElem(
    "li",
    {
      class: is_liked ? "active" : "",
    },
    [icon, iconHover]
  );

  return like;
}

function createFavoriteBlock({ is_favourite }) {
  let icon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/selected.svg"),
    },
    []
  );

  let iconHover = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/selected_hover.svg"),
      class: "hover",
    },
    []
  );

  let favorite = createElem(
    "li",
    {
      class: is_favourite ? "active" : "",
    },
    [icon, iconHover]
  );

  return favorite;
}

async function init() {
  await createMenuContent().then(async (children) => {
    document.body.appendChild(children);
    processInput();
    const categoriesResponse = await getCategories();
    const categories = categoriesResponse.results;

    for (let i = 0; i < categories.length; i++) {
      const categoryId = categories[i].id;
      const categoryItems = createCategory(categoryId);
      const categoryContainer = document.querySelector(".categories .promt_item_content .drop_content .list");
      categoryContainer.appendChild(categoryItems);
    }
    await getFavorites();
    document.querySelector(".promt_bar").appendChild(createLoader());
  });
}

if (!localStorage.getItem("token")) {
  init();
} else {
  createSignedMenuContent().then((children) => {
    document.body.appendChild(children);
    const promptBarElement = document.querySelector(".promt_bar");
    if (promptBarElement) {
      promptBarElement.classList.add("active");
      promptBarElement.appendChild(createLoader());
    }
  });
}

function createUpgradeSubscriptionPopup() {
  console.log("createUpgradeSubscriptionPopup");
  const popup = document.createElement("div");
  popup.classList.add("popup", "prompt_details_popup", "active");

  const closeSpan = document.createElement("span");
  closeSpan.classList.add("close");
  popup.appendChild(closeSpan);

  closeSpan.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup_content");
  popupContent.classList.add("upgrade");
  popup.appendChild(popupContent);

  const closePopupSpan = document.createElement("span");
  closePopupSpan.classList.add("close_popup");
  popupContent.appendChild(closePopupSpan);

  const closeImg = document.createElement("img");
  closeImg.src = chrome.runtime.getURL("assets/images/close.svg");
  closeImg.alt = "";

  closeImg.addEventListener("click", () => {
    document.body.removeChild(popup);
  });

  closePopupSpan.appendChild(closeImg);

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  popupContent.appendChild(titleDiv);

  const titleHeading = document.createElement("h5");
  titleHeading.textContent = "Don`t success";
  titleDiv.appendChild(titleHeading);

  const promptPopupContentDiv = document.createElement("div");
  promptPopupContentDiv.classList.add("upgrade_popup_content");
  popupContent.appendChild(promptPopupContentDiv);

  const answerPara1 = document.createElement("p");
  answerPara1.classList.add("upgrade_popup_content");

  answerPara1.textContent = "You need upgrade your subscription to this element";
  promptPopupContentDiv.appendChild(answerPara1);

  return popup;
}
