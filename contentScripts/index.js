let selectedTone = localStorage.getItem("tone");
let selectedStyle = localStorage.getItem("style");
let isClickBookmark = false;
let selectedDocumentBookmark = null;
let selectedMessageChatGPTBookmark = null;
console.log({ selectedTone, selectedStyle });

sessionStorage.setItem("isReload", false);

const bookmarks = [
  "Marketing site redesign",
  "Greek Mythology 101",
  "The Art of Culinary Fusion: Blending Flavors from Around the World",
  "Hello world",
  "The marketing of Apple Design",
];

function customFetch(url, options = {}) {
  return fetch(url, options).then(async (response) => {
    console.log("response.status", response.status);
    if (response.status === 401) {
      const wasReloadedPage = JSON.parse(sessionStorage.getItem("isReload"));

      if (!wasReloadedPage) {
        localStorage.clear();
        sessionStorage.setItem("isReload", true);
      }
      throw new Error("Unauthorized");
    }

    if (response.status === 400) {
      const isExistUpgradeSubscriptionPopup = document.querySelector(".prompt_details_popup");
      if (!isExistUpgradeSubscriptionPopup) {
        const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
        document.body.appendChild(upgradeSubscriptionPopup);
      }
    }
    return response;
  });
}

async function getSubscriptionLevel() {
  const API_URL = "https://gotgood.ai";

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `token ${localStorage.getItem("token")}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let response = await customFetch(API_URL + "/api/user/subscription-level/", requestOptions);
  console.log("response", response);

  let result = await response.json();

  console.log("getSubscriptionLevel result", result);
  sessionStorage.setItem("subscription_tier", result.subscription_level);

  return result;
}

async function init() {
  const token = localStorage.getItem("token");

  if (token) {
    const res = await getSubscriptionLevel();
    $("body").addClass("subscription_tier_loaded");
    console.log("getSubscriptionLevel".toUpperCase(), res);
    // console.log("hide_ai_recommendations", hide_ai_recommendations);
    if (!res?.hide_ai_recommendations) $("body").addClass("hide_ai_recommendations");
    if (!res?.hide_fast_prompt) $("body").addClass("hide_fast_prompt");
    if (!res?.hide_style_button) $("body").addClass("hide_style_button");
    if (!res?.hide_tone_button) $("body").addClass("hide_tone_button");
  }
}

init();

function applyCurrentTheme() {
  let body = $("body");
  body.attr("class", `${selectedTone} ${selectedStyle}`);
  body.css("--mainbg", `url("${chrome.runtime.getURL(`assets/images/${selectedTone}.png`)}")`);
}
applyCurrentTheme();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.theme) {
    selectedTone = request.theme;
    applyCurrentTheme();
  }
});

$("body").attr("id", "global");

$("body").css("--dropdown-icon", `url("${chrome.runtime.getURL(`assets/images/CaretDown2.svg`)}")`);
$("body").css("--dropdown-icon-hover", `url("${chrome.runtime.getURL(`assets/images/CaretDown2_hover.svg`)}")`);

function createChatMessageButtons(container, isClickBookmark) {
  const button1 = createButton(
    "p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible",
    "currentColor",
    "2",
    "0 0 24 24",
    "round",
    "round",
    "h-4 w-4",
    "assets/images/copy.svg"
  );
  button1.classList.add("btn_1");

  button1.onclick = (e) => {
    e.preventDefault();

    const copyText = container.parentNode.querySelector(".break-words").innerText;
    console.log(copyText);
    navigator.clipboard.writeText(copyText);
  };

  // const button2 = createButton('p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible', '', '', '', '', '', '', 'assets/images/thumbs-up2.svg');
  // const button3 = createButton('p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible', '', '', '', '', '', '', 'assets/images/thumbs-down2.svg');

  const bookmark = createButton(
    "p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible",
    "",
    "",
    "",
    "",
    "",
    "",
    "assets/images/bookmark.svg"
  );
  const bookmarkYellow = createButton(
    "p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible",
    "",
    "",
    "",
    "",
    "",
    "",
    "assets/images/bookmarkYellow.svg"
  );

  const addNewDocumentButton = createButton(
    "p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible",
    "",
    "",
    "",
    "",
    "",
    "",
    "assets/images/file_plus.svg"
  );

  addNewDocumentButton.classList.add("btn_1");

  bookmarkYellow.classList.add("btn_1");

  bookmark.classList.add("saveBtn");
  bookmark.classList.add("btn_1");
  bookmark.onclick = async (e) => {
    e.preventDefault();

    const subscriptionTier = getUserSubscriptionTier();
    if (subscriptionTier === "free") {
      const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
      document.body.appendChild(upgradeSubscriptionPopup);
      return;
    }

    const getMessageChatGpt = () => $(container).parent().parent().find(".break-words");
    const isExistMessageChatGpt = () => getMessageChatGpt().length > 0;

    if (isExistMessageChatGpt()) {
      const textChatGpt = getMessageChatGpt().text();
      bookmark.remove();
      container.insertBefore(bookmarkYellow, addNewDocumentButton);

      const requestData = {
        file: textChatGpt,
      };
      await createNewBookmarkDocument(requestData);

      // await createBookmark(textChatGpt);
    }

    isClickBookmark = true;
  };

  addNewDocumentButton.onclick = async (e) => {
    e.preventDefault();

    const subscriptionTier = getUserSubscriptionTier();
    if (subscriptionTier === "free") {
      const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
      document.body.appendChild(upgradeSubscriptionPopup);
      return;
    }

    const getMessageChatGpt = () => $(container).parent().parent().find(".break-words");
    const isExistMessageChatGpt = () => getMessageChatGpt().length > 0;

    if (isExistMessageChatGpt()) {
      const textChatGpt = getMessageChatGpt().text();

      function afterSuccessSavedBookmark() {
        // bookmark.remove();
        // container.insertBefore(bookmarkYellow, addNewDocumentButton);
      }
      // await createBookmark(textChatGpt);

      const smallPopup = await createPopupBookmark(textChatGpt, afterSuccessSavedBookmark);
      document.body.appendChild(smallPopup);

      // const body = document.querySelector("body");
      // body.addEventListener("click", (e) => {
      //   if (
      //     e.target !== smallPopup &&
      //     e.target !== addNewDocumentButton &&
      //     e.target !== addNewDocumentButton.children[0]
      //   ) {
      //     smallPopup.remove();
      //   }
      // });

      // container?.parentNode?.parentNode?.appendChild(smallPopup);
    }

    isClickBookmark = true;
  };

  // container.appendChild(button1);
  // container.appendChild(button2);
  // container.appendChild(button3);

  if (!isClickBookmark) {
    container.appendChild(bookmark);
  }
  container.appendChild(addNewDocumentButton);
}

function checkAndUpdateChatMessageButtons(isClickBookmark) {
  const selector =
    "#global .relative.transition-width .w-full .text-gray-400.flex.self-end.justify-center.mt-2.gap-2.visible";
  const elements = Array.from(document.querySelectorAll(selector));
  let k = 0;
  elements.forEach((element) => {
    ++k;
    if (!element.querySelector(".btn_1") && k % 2 === 0) {
      createChatMessageButtons(element, isClickBookmark);
    }
  });
}

setInterval(() => checkAndUpdateChatMessageButtons(isClickBookmark), 1000);

function createButton(className, stroke, strokeWidth, viewBox, strokeLinecap, strokeLinejoin, svgClass, imgSrc) {
  const button = document.createElement("button");
  button.className = className;

  if (imgSrc) {
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL(imgSrc);
    img.alt = "";
    button.appendChild(img);
  } else {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("stroke", stroke);
    svg.setAttribute("stroke-width", strokeWidth);
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("stroke-linecap", strokeLinecap);
    svg.setAttribute("stroke-linejoin", strokeLinejoin);
    svg.className = svgClass;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.appendChild(path);
    button.appendChild(svg);
  }

  return button;
}

// document.querySelector('').appendChild(container);

createSpinner = () => {
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spinner.style.display = "none";
  const spinnerChild = document.createElement("div");
  spinnerChild.className = "spinner";
  spinner.appendChild(spinnerChild);
  $("body").append(spinner);
  return spinner;
};

async function createPopupBookmark(bookmark, afterSuccessSavedBookmark) {
  const saveBookmarkPopup = await createSaveBookmarkPopup(bookmark, afterSuccessSavedBookmark);
  return saveBookmarkPopup;
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
  titleHeading.textContent = "Upgrade your account";
  titleDiv.appendChild(titleHeading);

  const promptPopupContentDiv = document.createElement("div");
  popupContent.appendChild(promptPopupContentDiv);

  const answerPara1 = document.createElement("p");
  answerPara1.classList.add("upgrade_popup_content");

  answerPara1.textContent =
    "You've reached the maximum capacity of bookmarks for this plan. Upgrade to the Pro plan for bla bla..";
  promptPopupContentDiv.appendChild(answerPara1);

  const wrapperBtn = document.createElement("div");
  wrapperBtn.classList.add("wrapperBtn");

  const btnUpgrade = document.createElement("button");
  btnUpgrade.classList.add("btn-upgrade");
  btnUpgrade.textContent = "Upgrade now";

  btnUpgrade.onclick = () => {
    popup.remove();
    const subscriptionPopup = createSubscriptionPopup();
    document.body.appendChild(subscriptionPopup);
  };

  wrapperBtn.appendChild(btnUpgrade);
  // promptPopupContentDiv.appendChild(btnUpgrade);
  promptPopupContentDiv.appendChild(wrapperBtn);

  return popup;
}

function createNewDocumentPopup(bookmark, afterSuccessSavedBookmark) {
  console.log("createPromptDetailsPopup_______");

  const popup = document.createElement("div");
  popup.classList.add("popup", "prompt_details_popup", "active");

  const closeSpan = document.createElement("span");
  closeSpan.classList.add("close");
  popup.appendChild(closeSpan);

  closeSpan.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup_content", "bookmark_new_document_popup");
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
  titleHeading.textContent = "Create new document";
  titleDiv.appendChild(titleHeading);

  const promptPopupContentDiv = document.createElement("div");
  promptPopupContentDiv.classList.add("bookmark_new_document");
  popupContent.appendChild(promptPopupContentDiv);

  const input = document.createElement("input");
  input.classList.add("new_document_input");
  input.placeholder = "New document name";
  input.type = "text";

  promptPopupContentDiv.appendChild(input);

  const bottomDiv = document.createElement("div");
  bottomDiv.classList.add("bottom");
  popupContent.appendChild(bottomDiv);

  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("bookmark_new_document_btn");
  cancelBtn.classList.add("bookmark_new_document_cancel_btn");
  cancelBtn.textContent = "Cancel";

  const createBtn = document.createElement("button");
  createBtn.classList.add("bookmark_new_document_btn");
  createBtn.classList.add("bookmark_new_document_create_btn");

  createBtn.textContent = "Create";

  cancelBtn.addEventListener("click", (e) => {
    document.body.removeChild(popup);
  });

  createBtn.addEventListener("click", async (e) => {
    const requestData = {
      name: input?.value,
      file: bookmark,
    };
    await createNewBookmarkDocument(requestData);
    afterSuccessSavedBookmark();
    document.body.removeChild(popup);
  });

  bottomDiv.appendChild(cancelBtn);
  bottomDiv.appendChild(createBtn);

  return popup;
}

async function createSaveBookmarkPopup(bookmark, afterSuccessSavedBookmark) {
  selectedMessageChatGPTBookmark = bookmark;
  const popup = document.createElement("div");
  popup.classList.add("popup", "prompt_details_popup", "active");

  const closeSpan = document.createElement("span");
  closeSpan.classList.add("close");
  popup.appendChild(closeSpan);

  closeSpan.addEventListener("click", () => {
    popup.remove();
  });

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup_content", "bookmark_popup");
  popup.appendChild(popupContent);

  // const closePopupSpan = document.createElement("span");
  // closePopupSpan.classList.add("close_popup");
  // popupContent.appendChild(closePopupSpan);

  // const closeImg = document.createElement("img");
  // closeImg.src = chrome.runtime.getURL("assets/images/close.svg");
  // closeImg.alt = "";

  // closeImg.addEventListener("click", () => {
  //   document.body.removeChild(popup);
  // });

  // closePopupSpan.appendChild(closeImg);

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  popupContent.appendChild(titleDiv);

  const wrapperCreateNewDocumentDiv = document.createElement("div");
  wrapperCreateNewDocumentDiv.classList.add("wrapper_create_new_document");
  popupContent.appendChild(wrapperCreateNewDocumentDiv);

  const createText = document.createElement("div");
  createText.textContent = "Create";
  createText.classList.add("create_text");
  wrapperCreateNewDocumentDiv.appendChild(createText);

  const createNewDocumentDiv = document.createElement("div");
  createNewDocumentDiv.classList.add("create_new_document");

  createNewDocumentDiv.onclick = async () => {
    const requestData = {
      file: bookmark,
    };
    await createNewBookmarkDocument(requestData);
    // const newDocumentPopup = createNewDocumentPopup(bookmark, afterSuccessSavedBookmark);
    // document.body.appendChild(newDocumentPopup);
    popup.remove();
  };

  const wrapperNewDocumentImg = document.createElement("div");
  wrapperNewDocumentImg.classList.add("wrapper_new_document_img");

  const newDocumentImg = document.createElement("img");
  newDocumentImg.src = chrome.runtime.getURL("assets/images/file_plus.svg");

  const createNewDocumentDivText1 = document.createElement("div");
  const createNewDocumentDivContent = document.createElement("div");
  createNewDocumentDivContent.classList.add("create_new_document_content");

  createNewDocumentDivText1.classList.add("create_new_document_text_1");
  createNewDocumentDivText1.textContent = "Create new document";

  const createNewDocumentDivText2 = document.createElement("div");
  createNewDocumentDivText2.classList.add("create_new_document_text_2");
  createNewDocumentDivText2.textContent = "Lorem ipsum dolor sit amet";

  createNewDocumentDivContent.appendChild(createNewDocumentDivText1);
  createNewDocumentDivContent.appendChild(createNewDocumentDivText2);

  wrapperNewDocumentImg.appendChild(newDocumentImg);
  createNewDocumentDiv.appendChild(wrapperNewDocumentImg);
  createNewDocumentDiv.appendChild(createNewDocumentDivContent);
  wrapperCreateNewDocumentDiv.appendChild(createNewDocumentDiv);

  const bookmarks = await searchBookmark();

  const recentText = document.createElement("div");
  recentText.textContent = "Recent";
  recentText.classList.add("recent_text");
  const search = createSearchByBookmark(bookmarks, recentText);

  titleDiv.appendChild(search);

  const promptPopupContentDiv = document.createElement("div");
  promptPopupContentDiv.classList.add("bookmark_new_document");
  popupContent.appendChild(promptPopupContentDiv);

  const bookmarkList = createBookmarkList(bookmarks);
  console.log("bookmarkList", bookmarkList);

  // promptPopupContentDiv.appendChild(search);
  promptPopupContentDiv.appendChild(recentText);
  promptPopupContentDiv.appendChild(bookmarkList);

  // const bottomDiv = document.createElement("div");
  // bottomDiv.classList.add("bottom");
  // popupContent.appendChild(bottomDiv);

  // const cancelBtn = document.createElement("button");
  // cancelBtn.classList.add("bookmark_new_document_btn");
  // cancelBtn.classList.add("bookmark_new_document_cancel_btn");
  // cancelBtn.textContent = "Cancel";

  // const saveBtn = document.createElement("button");
  // saveBtn.classList.add("bookmark_new_document_btn", "bookmark_btn_disabled");
  // saveBtn.setAttribute("disabled", "true");

  // saveBtn.onclick = async () => {
  //   if (!selectedDocumentBookmark) return;
  //   console.log("selectedDocumentBookmark", selectedDocumentBookmark);
  //   const requestObj = { name: selectedDocumentBookmark?.name, file: bookmark };
  //   const id = selectedDocumentBookmark?.id;
  //   await replaceExitingDocumentBookmark(requestObj, id);
  //   afterSuccessSavedBookmark();
  //   popup.remove();
  // };

  // saveBtn.classList.add("bookmark_new_document_save_btn");

  // saveBtn.textContent = "Save";

  // cancelBtn.addEventListener("click", (e) => {
  //   popup.remove();
  // });

  // bottomDiv.appendChild(cancelBtn);
  // bottomDiv.appendChild(saveBtn);
  console.log("popup", popup);
  return popup;
}

function createSearchByBookmark(bookmarks = [], renderBeforeBlock) {
  const searchInput = createElem(
    "input",
    {
      type: "search",
      id: "search",
      placeholder: "Search",
      class: "search_by_bookmark",
    },
    []
  );

  // const debouncedProcessInput = debounce(processInput, 500);

  const filterByBookmark = async (e) => {
    // const searchValueLoverCase = e.target?.value.toLowerCase();

    const filteredBookmark = await searchBookmark(e.target?.value);

    // let filteredBookmark = bookmarks.filter((bookmarkText) =>
    //   bookmarkText.toLowerCase().includes(searchValueLoverCase)
    // );

    const existBookmarkList = document.querySelector(".bookmark_list");
    if (existBookmarkList) existBookmarkList.remove();

    const newBookmarkList = createBookmarkList(filteredBookmark);
    renderBeforeBlock.insertAdjacentElement("afterend", newBookmarkList);
  };

  const debouncedProcessInput = debounce(filterByBookmark, 500);

  searchInput.addEventListener("input", debouncedProcessInput);

  let searchIcon = createElem(
    "img",
    {
      src: chrome.runtime.getURL("assets/images/search_gray.svg"),
    },
    []
  );

  let searchButton = createElem("button", { class: "search_bookmark_btn" }, [searchIcon]);

  const search = createElem("div", { class: "search" }, [searchButton, searchInput]);

  const wrapperSearch = createElem("div", { class: "wrapper_search" }, [search]);

  search.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  return wrapperSearch;
}

function createBookmarkList(bookmarks) {
  const bookmarksUl = document.createElement("ul");
  bookmarksUl.classList.add("bookmark_list");

  bookmarks.forEach((bookmarkObj) => {
    const bookmark = document.createElement("li");
    bookmark.classList.add("wrapper_bookmark_text");
    bookmark.onclick = async () => {
      // const activeDocumentBookmark = document.querySelector(".active_document_bookmark");
      // if (activeDocumentBookmark) activeDocumentBookmark.classList.remove("active_document_bookmark");
      // bookmark.classList.add("active_document_bookmark");

      // if (!bookmarkObj) return;
      if (!selectedMessageChatGPTBookmark) return;

      const requestObj = { name: bookmarkObj?.name, file: selectedMessageChatGPTBookmark };
      const id = bookmarkObj?.id;
      await replaceExitingDocumentBookmark(requestObj, id);

      const popup = document.querySelector(".popup.prompt_details_popup.active");
      popup.remove();

      selectedMessageChatGPTBookmark = null;
      // const saveBtn = document.querySelector(".bookmark_new_document_save_btn");
      // saveBtn.removeAttribute("disabled");
      // saveBtn.classList.remove("bookmark_btn_disabled");
    };

    const bookmarkIcon = createBookmarkIcon();
    const text = document.createElement("span");
    text.textContent = bookmarkObj?.name;

    text.classList.add("bookmark_text");

    bookmark.appendChild(bookmarkIcon);
    bookmark.appendChild(text);

    bookmarksUl.appendChild(bookmark);
  });
  return bookmarksUl;
}

function createBookmarkIcon() {
  const iconDocument = document.createElement("img");
  iconDocument.classList.add("bookmark_document");
  iconDocument.src = chrome.runtime.getURL("assets/images/document.svg");
  return iconDocument;
}
