let isGetCommandRequest = false;

let concatPromsterBEAndBasePrompster = [];
let changedConcatPromsterBEAndBasePrompster = [];
let currHoverPrompsterIndex = 0;
let isShowCommandPopup = false;
let isBlurCommandPopup = false;

const prompsterComands = [
  {
    prompt: "Get an answer to a question",
    command: "/ask",
    related_prompt: null,
    isHover: false,
  },
  {
    prompt: "Tell me more about this",
    command: "/tell",
    related_prompt: null,
    isHover: false,
  },
  { prompt: "Expand details", command: "/expand", related_prompt: null, isHover: false },
  {
    prompt: "Give me better suggestions",
    command: "/suggest",
    related_prompt: null,
    isHover: false,
  },
  { prompt: "Wrap this up", command: "/wrap", related_prompt: null, isHover: false },
];

function createElementModal(tag, attributes, children) {
  const elem = document.createElement(tag);
  Object.keys(attributes).forEach((key) => {
    elem.setAttribute(key, attributes[key]);
  });
  children.forEach((child) => {
    elem.appendChild(child);
  });
  return elem;
}

function sendModalInput(selected_prompt) {
  let send_button = document.querySelector("form > div > div > button");
  let textarea = document.querySelector("textarea");
  textarea.value = selected_prompt;

  // Create and dispatch the input event
  let event = new Event("input", {
    bubbles: true,
    cancelable: true,
  });
  textarea.dispatchEvent(event);
  send_button.removeAttribute("disabled");
  send_button.click();
}

function createUlFromItems(items) {
  console.log("items", items);

  const ul = document.createElement("ul");
  ul.id = "prompsterList";
  ul.style.overflowY = "auto";
  ul.style.maxHeight = "200px";

  // Теперь добавим элементы li (liItems) в созданный ul

  const liItems = [];
  items.forEach((item) => {
    const spanNode = createElementModal("span", {}, [document.createTextNode(item.command)]);
    const textNode = document.createTextNode(" " + item.prompt);
    const li = createElementModal(
      "li",
      {
        class: "prompster-item visible",
        value: item.command,
        "data-command": item.prompt,
      },
      [spanNode, textNode]
    );

    if (item?.isHover) {
      console.log("item?.isHover", item?.isHover);
      li.classList.add("item_hover");
    }

    function onShowPromptPopupById(prompt) {
      document.body.appendChild(createPromptDetailsPopup(prompt));
    }

    li.onclick = (e) => {
      if (item?.related_prompt === null) {
        sendModalInput(li.getAttribute("data-command"));
      } else {
        e.preventDefault();
        e.stopPropagation();
        onShowPromptPopupById(item.related_prompt);
      }

      changedConcatPromsterBEAndBasePrompster = concatPromsterBEAndBasePrompster;
      isShowCommandPopup = false;
      prompster.remove();
    };

    liItems.push(li);
  });

  liItems.forEach((li) => {
    ul.appendChild(li);
  });

  // return createElementModal("ul", { id: "prompsterList", style: "overflow-y: auto; max-height: 200px;" }, liItems);
  return ul;
}

function filterPrompsterItems(searchText) {
  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  Array.from(document.querySelectorAll(".prompster-item")).forEach((item) => {
    const itemCommand = item.getAttribute("value");
    const itemText = normalizeText(itemCommand);

    const searchRegExp = new RegExp(normalizeText(searchText), "g");
    if (!itemText.match(searchRegExp)) {
      item.style.display = "none";
      item.classList.remove("visible");

      changedConcatPromsterBEAndBasePrompster = concatPromsterBEAndBasePrompster.filter((p) =>
        p.command.includes(searchText)
      );
      currHoverPrompsterIndex = 0;
    } else {
      item.style.display = "list-item";
      item.classList.add("visible");
      if (searchText === "") {
        changedConcatPromsterBEAndBasePrompster = concatPromsterBEAndBasePrompster;
      } else {
        changedConcatPromsterBEAndBasePrompster = concatPromsterBEAndBasePrompster.filter(
          (p) => !p.command.includes(searchText)
        );
      }

      currHoverPrompsterIndex = 0;
    }
    const selectorPromster = document.querySelector("#prompster");
    selectorPromster?.remove();
  });
}

async function getPrompsterCommands() {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `token ${localStorage.getItem("token")}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let response = await fetch("https://gotgood.ai/api/shop/get-commands/", requestOptions)
    .then((response) => {
      if (response.status === 402) {
        const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
        document.body.appendChild(upgradeSubscriptionPopup);
      }
      return response;
    })
    .catch((error) => console.log("error", error));

  let result = await response?.json();
  console.log("result", result);
  return result.results;
}

function createPrompster() {
  console.log("changedConcatPromsterBEAndBasePrompster", changedConcatPromsterBEAndBasePrompster);
  const ul = createUlFromItems(changedConcatPromsterBEAndBasePrompster);
  const prompster = createElementModal("div", { id: "prompster", class: "prompster" }, [ul]);

  return prompster;
}

function addPrompster() {
  console.log("addPrompster___");
  const container = document.querySelector("#prompt-textarea")?.parentElement;
  const prompster = createPrompster();
  container?.appendChild(prompster);
  const textArea = document.querySelector("#prompt-textarea");
  const selectorPromster = document.querySelector("#prompster");
  const selectorUlPromster = selectorPromster?.querySelector("ul");
  const childs = selectorUlPromster.querySelectorAll(".prompster-item.visible");

  if (isShowCommandPopup) {
    selectorPromster.classList.add("active");
    selectorUlPromster.classList.add("active");
  } else {
    selectorPromster.classList.remove("active");
    selectorUlPromster.classList.remove("active");
  }

  // Прокручиваем контейнер до целевого ребенка
  selectorUlPromster.scrollTop = childs[currHoverPrompsterIndex]?.offsetTop;
  childs[currHoverPrompsterIndex]?.focus();

  $(textArea)
    .off("input")
    .on("input", function (e) {
      console.log("e.target.value", e.target.value);
      if (selectorPromster.classList.contains("active")) {
        filterPrompsterItems(e.target.value);
      }
    });

  $(textArea)
    .off("keydown")
    .on("keydown", function (e) {
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> first  start

      if (e.keyCode === 27) {
        selectorPromster.classList.remove("active");
        selectorUlPromster.classList.remove("active");
      }

      function willChangeHoverItem(currHoverPrompsterIndex) {
        changedConcatPromsterBEAndBasePrompster = changedConcatPromsterBEAndBasePrompster.map((p, idx) =>
          idx === currHoverPrompsterIndex ? { ...p, isHover: true } : { ...p, isHover: false }
        );
      }

      if (e.keyCode === 38) {
        if (currHoverPrompsterIndex === 0) {
          willChangeHoverItem(currHoverPrompsterIndex);
          prompster.remove();
        } else {
          currHoverPrompsterIndex = currHoverPrompsterIndex - 1;
          willChangeHoverItem(currHoverPrompsterIndex);
          prompster.remove();
        }
      }

      if (e.keyCode === 40) {
        const lastIndex = changedConcatPromsterBEAndBasePrompster.length - 1;
        if (currHoverPrompsterIndex === lastIndex) {
          willChangeHoverItem(currHoverPrompsterIndex);
          prompster.remove();
        } else {
          currHoverPrompsterIndex = currHoverPrompsterIndex + 1;
          willChangeHoverItem(currHoverPrompsterIndex);
          prompster.remove();
        }
      }

      if (e.key === "/" && textArea.value.length == 0) {
        e.preventDefault();
        isShowCommandPopup = true;
        selectorPromster.classList.add("active");
        selectorUlPromster.classList.add("active");

        if (selectorPromster.classList.contains("active")) {
          textArea.value = "";
          filterPrompsterItems("");
        }
      }
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> first end
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>second start

      if (e.key == "Enter" && selectorPromster.classList.contains("active")) {
        e.preventDefault();
        const visibleItems = document.querySelectorAll(".prompster-item.visible");
        if (visibleItems.length > 0) {
          visibleItems[currHoverPrompsterIndex].click();
          selectorPromster.classList.remove("active");
          selectorUlPromster.classList.remove("active");
          changedConcatPromsterBEAndBasePrompster = concatPromsterBEAndBasePrompster;
          isShowCommandPopup = false;
          prompster.remove();
        }
      }

      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>second end

      if (e.code === "Enter") {
        let isCommandMessageByShowModal = changedConcatPromsterBEAndBasePrompster.some(({ command }) =>
          command.includes(e?.target?.value.trim())
        );

        if (isCommandMessageByShowModal) {
          e.preventDefault();
          e.stopPropagation();
          const textArea = document.querySelector("textarea");
          textArea.value = "";
        }
        addSelectedCategoriesValueInEndTextareaValue();
      }
    });

  $(textArea)
    .off("blur")
    .on("blur", function () {
      setTimeout(() => {
        selectorPromster.classList.remove("active");
        selectorUlPromster.classList.remove("active");
        isShowCommandPopup = false;
      }, 100);
    });
}

// observer обернуть функцией селать запрос после успешного запроса уже писать код   observer
// 1. сделать запрос на бекенд
// 2. получить ответ

async function init() {
  let isCreatePromster = false;
  let result = (await getPrompsterCommands()) ?? [];
  if (result.detail == "Invalid token.") {
    result = [];
  }
  console.log("result_____init", result);

  const propmsterBEWithIsHoverProperty = result?.map((p) => ({ ...p, isHover: false }));
  const propmsterBEWithSlash = propmsterBEWithIsHoverProperty?.map((p) =>
    p.command.includes("/") ? p : { ...p, command: `/${p.command}` }
  );
  concatPromsterBEAndBasePrompster = [...prompsterComands, ...propmsterBEWithSlash];
  changedConcatPromsterBEAndBasePrompster = concatPromsterBEAndBasePrompster;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const idPrompster = document.getElementById("prompster");
        if (idPrompster == null || idPrompster == undefined) {
          addPrompster();
          isCreatePromster = true;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

init();

function createPromptDetailsPopup({
  name,
  description,
  amount_of_lookups,
  like_amount,
  inputs = [],
  prompt_template,
  categories,
  is_liked,
  is_favourite,
  id,
}) {
  console.log("categories", categories);
  console.log("1111111");
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

  categories.forEach((categoryObj) => {
    const isHasColor = !!categoryObj?.color;
    let category = null;
    let svg = null;

    const color = categoryObj?.color ? categoryObj?.color : "#b99f15";
    const backgroundColor = categoryObj?.background_color ? categoryObj?.background_color : "rgba(185, 159, 21, 0.1)";
    const borderColor = categoryObj?.stroke_color ? categoryObj?.stroke_color : "rgba(185, 159, 21, 0.2)";
    category = createElem(
      "div",
      {
        class: "badge",
        style: `background-color: ${backgroundColor}; color: ${color}; border: 1px solid ${borderColor}`,
      },
      []
    );

    // const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svgElement.setAttribute("width", "10");
    // svgElement.setAttribute("height", "12");
    // svgElement.setAttribute("viewBox", "0 0 10 12");
    // svgElement.setAttribute("fill", "none");

    // const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // pathElement.setAttribute(
    //   "d",
    //   "M9.16655 7.33268C9.16655 9.99935 7.33325 10.8327 4.99988 10.8327C2.33325 10.8327 0.833252 8.93268 0.833252 7.33268C0.833252 5.73268 1.66659 4.27713 2.33325 3.83268C2.33325 5.69935 4.111 6.88824 4.99988 6.83268C3.39988 4.43268 4.77766 1.77713 5.66655 1.16602C5.66655 4.16602 9.16655 4.66602 9.16655 7.33268Z"
    // );
    // pathElement.setAttribute("stroke", "#b99f15");
    // pathElement.setAttribute("stroke-linecap", "round");
    // pathElement.setAttribute("stroke-linejoin", "round");
    // svgElement.appendChild(pathElement);

    const svgWrapper = document.createElement("div");

    if (categoryObj?.icon) {
      const icon = document.createElement("img");
      icon.classList.add("prompt_category_img");
      icon.src = categoryObj?.icon;
      svgWrapper.appendChild(icon);
    }

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

    categoriesUl.appendChild(category);
  });

  // categories.forEach((category) => {
  //   const categoryLi = document.createElement("li");
  //   categoryLi.classList.add("prompt_category");

  //   const categoryIcon = document.createElement("img");
  //   categoryIcon.classList.add("category_icon");
  //   categoryIcon.src = chrome.runtime.getURL("assets/images/flames.svg");
  //   console.log("categoryIcon", categoryIcon);
  //   categoryIcon.alt = "category icon";
  //   categoryLi.appendChild(categoryIcon);

  //   const categorySpan = document.createElement("span");
  //   categorySpan.textContent = category?.name;
  //   categoryLi.appendChild(categorySpan);

  //   categoriesUl.appendChild(categoryLi);
  // });

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
      class: "modal_like_amount",
    },
    []
  );

  likeP.textContent += " " + processNumber(like_amount);

  let likes = createElem("li", {}, [likeIcon, likeP]);

  const likeBlock = document.createElement("li");
  likeBlock.classList.add("modal_like_block");
  likeBlock.appendChild(likes);
  statsList.appendChild(likeBlock);

  if (!like_amount || like_amount === 0) likeBlock.classList.add("modal_like_block_hidden");

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

  viewP.textContent += " " + processNumber(amount_of_lookups);

  let views = createElem("li", {}, [viewIcon, viewP]);

  const viewBlock = document.createElement("li");

  viewBlock.appendChild(views);
  if (amount_of_lookups) statsList.appendChild(viewBlock);

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
    // const span = document.createElement("span");
    // span.classList.add("form_inp_required");
    // span.textContent = " *";
    textareaLabel.innerHTML = `${labelText} <span class='form_inp_required'> *</span>`;
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
  console.log("inputs", inputs);
  inputs.forEach(({ variable_name, placeholder, is_textarea }) => {
    // if (is_textarea) {
    const textareaDiv = createTextarea(variable_name, placeholder, handleInputValueChange);
    form.appendChild(textareaDiv);
    // } else {
    //   const inputDiv = createInput(variable_name, "text", placeholder, handleInputValueChange);
    //   form.appendChild(inputDiv);
    // }
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
      console.log("modalState_________", modalState);

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
              // div.parentNode.parentNode.parentNode.parentNode.style.display = "none";
              let text = modalState.map((obj) => obj?.variable_name + " = " + obj?.value).join("\n");
              childDiv.textContent = text;
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

    const changeLikeAmount = (like_amount) => {
      let likeAmount;
      const likeBlock = document.querySelector(".modal_like_block");
      const likeAmountText = document.querySelector(".modal_like_amount");

      if (like_amount === 0 && !isLiked) {
        likeBlock.classList.add("modal_like_block_hidden");
        likeAmount = 0;
        likeAmountText.textContent = likeAmount;
      } else if (isLiked) {
        likeBlock.classList.remove("modal_like_block_hidden");
        likeAmount = like_amount + 1;
        likeAmountText.textContent = processNumber(likeAmount);
      } else {
        likeAmount = like_amount - 1;
        likeAmountText.textContent = processNumber(likeAmount);
        if (likeAmount === 0) {
          likeBlock.classList.add("modal_like_block_hidden");
        } else likeBlock.classList.remove("modal_like_block_hidden");
      }
      return likeAmount;
    };

    localPrompts = localPrompts.map((prompt) =>
      prompt?.id === id
        ? { ...prompt, is_liked: !is_liked, like_amount: changeLikeAmount(prompt?.like_amount) }
        : prompt
    );

    const promptBarContentList = document.querySelector(".drop_content.list");
    const promptBarContentGrid = document.querySelector(".drop_content.grid");

    createPrompts(localPrompts || [], promptBarContentList, ".drop_content.list");
    createPrompts(localPrompts || [], promptBarContentGrid, ".drop_content.grid");

    if (like.classList.contains("active_like")) {
      like.classList.remove("active_like");
    } else {
      like.classList.add("active_like");
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

    localPrompts = localPrompts.map((prompt) =>
      prompt?.id === id ? { ...prompt, is_favourite: !is_favourite } : prompt
    );

    const promptBarContentList = document.querySelector(".drop_content.list");
    const promptBarContentGrid = document.querySelector(".drop_content.grid");

    createPrompts(localPrompts || [], promptBarContentList, ".drop_content.list");
    createPrompts(localPrompts || [], promptBarContentGrid, ".drop_content.grid");

    if (favorite.classList.contains("active_favorite")) {
      favorite.classList.remove("active_favorite");
    } else {
      favorite.classList.add("active_favorite");
    }
  });

  const subscriptionTier = getUserSubscriptionTier();

  let action;
  // selectedCategoryId

  if (subscriptionTier === "free") {
    if (selectedCategoryId === defaultCategoryIdEnum.CUSTOM) {
      action = createElem("ul", { class: "selected" }, []);
    } else if (categories.some((category) => category?.name === "Playground")) {
      action = createElem("ul", { class: "selected" }, [like]);
    } else {
      action = createElem("ul", { class: "selected" }, []);
    }
  } else {
    if (selectedCategoryId === defaultCategoryIdEnum.CUSTOM) {
      action = createElem("ul", { class: "selected" }, []);
    } else {
      action = createElem("ul", { class: "selected" }, [favorite, like]);
    }
  }

  return action;
}

function createLikeBlock({ is_liked }) {
  console.log("createLikeBlock".toUpperCase());
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
      class: is_liked ? "active_like" : "",
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
      class: is_favourite ? "active_favorite" : "",
    },
    [icon, iconHover]
  );

  return favorite;
}

function processNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    const remainder = number % 1000;
    if (remainder === 0 || remainder < 100) {
      return Math.floor(number / 1000) + "к";
    } else {
      return Math.floor(number / 100) / 10 + "к";
    }
  } else {
    const remainder = number % 1000000;
    if (remainder === 0 || remainder < 100000) {
      return Math.floor(number / 1000000) + "м";
    } else {
      return Math.floor(number / 100000) / 10 + "м";
    }
  }
}
