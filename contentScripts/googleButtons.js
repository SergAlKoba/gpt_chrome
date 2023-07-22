document
  .querySelector(":root")
  .style.setProperty("--followUpCaretDown", `url(${chrome.runtime.getURL("assets/images/follow_up_CaretDown.svg")})`);
document
  .querySelector(":root")
  .style.setProperty("--toneCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);
document
  .querySelector(":root")
  .style.setProperty("--styleCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);
document
  .querySelector(":root")
  .style.setProperty("--languageCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);

let accessSubscriptionTierForIdea = ["tier2", "tier3"];

function getUserSubscriptionTier() {
  const subscriptionTier = sessionStorage.getItem("subscription_tier");
  if (subscriptionTier === null || subscriptionTier === "0") return "free";
  if (subscriptionTier === "1") return "tier1";
  if (subscriptionTier === "2") return "tier2";
  if (subscriptionTier === "3") return "tier3";
}

async function getTooltips(output) {
  console.log("getTooltips", output);
  try {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `token ${localStorage.getItem("token")}`);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify({
        output: output,
      }),
    };

    let response = await fetch("https://gotgood.ai/api/chat/tooltip-search/", requestOptions).then((response) => {
      if (response.status === 402) {
        const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
        document.body.appendChild(upgradeSubscriptionPopup);
      }
      return response;
    });

    let result = await response.json();
    return result;
  } catch (e) {
    console.log("error getTooltips", e);
    return { isError: true, message: "Unfortunately no prompts" };
  }
}

const languages = {
  English: "en-US",
  French: "fr-FR",
  Spanish: "es-ES",
  Russian: "ru-RU",
  Ukrainian: "uk-UA",
};

const googleStyles = [
  {
    title: "Default",
    name: "name 1",
    isAccess: true,
  },
  {
    title: "Narrative",
    name: "name 1",
    isAccess: true,
  },
  {
    title: "Expository",
    name: "name 2",
    isAccess: true,
  },
  {
    title: "Descriptive",
    name: "name 3",
    isAccess: true,
  },
  {
    title: "Persuasive",
    name: "name 4",
    isAccess: true,
  },
  {
    title: "Creative",
    name: "name 5",
    isAccess: true,
  },
  {
    title: "Technical",
    name: "name 6",
    isAccess: true,
  },
  {
    title: "Review",
    name: "name 7",
    isAccess: true,
  },
  {
    title: "Poetic",
    name: "name 8",
    isAccess: true,
  },
  {
    title: "Academic",
    name: "name 9",
    isAccess: true,
  },
  {
    title: "Business",
    name: "name 10",
    isAccess: true,
  },
];

const googleStylesSubscriptionTierFree = ["Default", "Narrative"];

const googleTones = [
  {
    title: "Default",
    name: "name 1",
    isAccess: true,
  },
  {
    title: "Formal",
    name: "name 1",
    isAccess: true,
  },
  {
    title: "Informal",
    name: "name 2",
    isAccess: true,
  },
  {
    title: "Optimistic",
    name: "name 3",
    isAccess: true,
  },
  {
    title: "Pessimistic",
    name: "name 4",
    isAccess: true,
  },
  {
    title: "Joyful",
    name: "name 5",
    isAccess: true,
  },
  {
    title: "Sad",
    name: "name 6",
    isAccess: true,
  },
  {
    title: "Sincere",
    name: "name 7",
    isAccess: true,
  },
  {
    title: "Hypocritical",
    name: "name 8",
    isAccess: true,
  },
  {
    title: "Fearful",
    name: "name 9",
    isAccess: true,
  },
  {
    title: "Hopeful",
    name: "name 10",
    isAccess: true,
  },
  {
    title: "Humorous",
    name: "name 11",
    isAccess: true,
  },
  {
    title: "Serious",
    name: "name 12",
    isAccess: true,
  },
];

const googleTonesSubscriptionTierFree = ["Default", "Formal"];

const languagesList = [
  {
    title: "Default",
    name: "name 1",
  },
  {
    title: "English",
    name: "name 1",
  },
  {
    title: "Russian",
    name: "name 2",
  },
  {
    title: "Ukrainian",
    name: "name 3",
  },
];

const categories = [
  {
    id: "tone-google",
    name: "Default",
    items: googleTones,
    className: "Tone",
    displayName: "Tone",
  },
  {
    id: "style-google",
    name: "Default",
    items: googleStyles,
    className: "Style",
    displayName: "Style",
  },
  //  {
  //     id: 'language-google', name: 'Default', items: languagesList, className: 'Language', displayName: 'Output language'
  // },
];

const followUpItems = [
  "Make this more consistent",
  "Tell me more about this",
  "Expand details",
  "Give me better suggestions",
  "Wrap this up",
];

function createUlSFromCategory(category) {
  const ul = document.createElement("ul");
  ul.style.minWidth = "100px";

  if (category.items[0].title !== "Default") {
    localStorage.setItem(
      "Prompt payload",
      !localStorage.getItem("Prompt payload")
        ? ` ${category.displayName}: ${category.items[0].title}`
        : localStorage.getItem("Prompt payload") + ` ${category.displayName}: ${category.items[0].title} `
    );
  } else if (localStorage.getItem("Prompt payload")) {
    localStorage.setItem(
      "Prompt payload",
      localStorage.getItem("Prompt payload").replace(new RegExp(`${category.displayName}: \\w+`), ``)
    );
    localStorage.removeItem(category.className);
  }

  category.items.forEach((item) => {
    const li = document.createElement("li");
    if (!item.isAccess) {
      li.classList.add("no_access_dropdown_item_category");
    }
    li.textContent = item.title;
    li.style.minWidth = "100%";
    li.onclick = function () {
      if (!item.isAccess) {
        const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
        document.body.appendChild(upgradeSubscriptionPopup);
        return;
      }

      itemClickHandler(category.className, category.displayName, item, li);
    };
    ul.appendChild(li);
  });

  return ul;
}

function itemClickHandler(type, displayName, item, li) {
  console.log(type, displayName, item);

  localStorage.setItem(type, item.title);

  if (!localStorage.getItem("Prompt payload")) {
    localStorage.setItem("Prompt payload", ` ${displayName}: ${item.title} `);
  } else {
    if (localStorage.getItem("Prompt payload").includes(displayName)) {
      localStorage.setItem(
        "Prompt payload",
        localStorage
          .getItem("Prompt payload")
          .replace(new RegExp(`${displayName}: \\w+`), `${displayName}: ${item.title}`)
      );
    } else {
      localStorage.setItem(
        "Prompt payload",
        localStorage.getItem("Prompt payload") + ` ${displayName}: ${item.title} `
      );
    }
  }

  li.parentElement.parentElement.querySelector("span").textContent = item.title;
}

const createElem = (tag, attributes, children) => {
  const elem = document.createElement(tag);

  for (const key in attributes) {
    elem.setAttribute(key, attributes[key]);
  }

  children?.forEach((child) => {
    if (typeof child === "string") {
      elem.appendChild(document.createTextNode(child));
    } else {
      elem.appendChild(child);
    }
  });

  return elem;
};

async function createIdeaPopup(last_message) {
  console.log("createIdeaPopup__________");
  const sendButton = document.querySelector("#global .stretch.mx-2.flex.flex-row.gap-3 .flex-grow.relative button");
  const parentElement = sendButton.parentNode;

  sendButton.classList.add("send_button");
  const ideaPopup = document.createElement("div");
  ideaPopup.className = "idea_popup";
  ideaPopup.classList.add("active");

  const spinner = createLoader();
  spinner.classList.add("idea_loader");

  ideaPopup.append(spinner);
  $(ideaPopup).insertAfter(sendButton);

  const list = document.createElement("ul");

  let data = await getTooltips(last_message);
  if (data?.isError) {
    const listItem = document.createElement("li");
    listItem.textContent = data.message;
    list.appendChild(listItem);
  }

  spinner.remove();

  ideaPopup.appendChild(list);

  for (let el of data["ideas"]) {
    const listItem = document.createElement("li");
    const imageStar = document.createElement("img");
    imageStar.src = chrome.runtime.getURL("assets/images/idea_starts.svg");
    imageStar.className = "idea_star";
    imageStar.alt = "";

    listItem.appendChild(imageStar);
    const div = document.createElement("div");
    div.className = "idea_text";
    div.textContent = el;
    listItem.appendChild(div);
    // listItem.textContent = el;
    listItem.addEventListener("click", () => {
      sendInput(listItem.textContent, true);

      for (let el of list.childNodes) {
        el.remove();
      }

      let ideaPopup = document.querySelector(".idea_popup");
      ideaPopup.remove();
    });
    list.appendChild(listItem);
  }

  return ideaPopup;
}

function createSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spinner.style.display = "none";
  const spinnerChild = document.createElement("div");
  spinnerChild.className = "spinner";
  spinner.appendChild(spinnerChild);

  return spinner;
}

function createImgIdea() {
  const image = document.createElement("img");
  image.src = chrome.runtime.getURL("assets/images/idea2.svg");
  image.alt = "";
  return image;
}

function createButtonIdea() {
  const ideaButton = document.createElement("div");
  ideaButton.className = "checklist idea_js";
  return ideaButton;
}

function createLinkIdea() {
  const linkElement = document.createElement("a");
  linkElement.href = "javascript:void(0)";
  return linkElement;
}

function createIdeaElement() {
  const buttonIdea = createButtonIdea();
  const linkIdea = createLinkIdea();
  const imgIdea = createImgIdea();

  linkIdea.appendChild(imgIdea);
  buttonIdea.appendChild(linkIdea);

  buttonIdea.addEventListener("click", async function () {
    const subscriptionTier = getUserSubscriptionTier();

    if (!accessSubscriptionTierForIdea.includes(subscriptionTier)) {
      const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
      document.body.appendChild(upgradeSubscriptionPopup);
      return;
    }

    let upgradeSubscriptionPopup = document.querySelector(".prompt_details_popup");
    if (upgradeSubscriptionPopup) {
      upgradeSubscriptionPopup.remove();
    }

    let ideaPopup = document.querySelector(".idea_popup");
    const isNotExistIdeaPopup = () => !ideaPopup;
    console.log("isNotExistIdeaPopup", isNotExistIdeaPopup());
    console.log("ideaPopup", ideaPopup);

    if (isNotExistIdeaPopup()) {
      await addIdeaPopup();
    } else if (ideaPopup) {
      ideaPopup.classList.toggle("active");
      ideaPopup.remove();
    } else {
      console.error("ideaPopup element is undefined");
    }
  });

  return buttonIdea;
}

async function addIdeaPopup() {
  let last_message = $("div.flex.flex-grow.flex-col.gap-3 > div > div > p").last().text();
  const ideaPopup = await createIdeaPopup(last_message);

  return ideaPopup; // return the ideaPopup so you can wait for it in the event listener
}

function createFollowUpDiv() {
  const createListItem = (text) => {
    const li = document.createElement("li");
    li.textContent = text;
    li.onclick = () => {
      const subscriptionTier = getUserSubscriptionTier();

      if (subscriptionTier === "free") {
        const upgradeSubscriptionPopup = createUpgradeSubscriptionPopup();
        document.body.appendChild(upgradeSubscriptionPopup);
        return;
      }
      const userInput = document.querySelector("textarea");
      userInput.value += ` ${text}`;
      console.log(text);
      const submitButton = userInput.parentElement.querySelector("button");
      submitButton.disabled = false;
      submitButton.click();
    };
    return li;
  };

  const createList = (items) => {
    const ul = document.createElement("ul");
    items.forEach((item) => {
      ul.appendChild(createListItem(item));
    });
    return ul;
  };

  const createFollowUpList = () => {
    const followUpList = createList(followUpItems);
    const followUpListItem = document.createElement("li");
    followUpListItem.textContent = "Quick-Reply";
    followUpListItem.appendChild(followUpList);
    const mainList = document.createElement("ul");
    mainList.appendChild(followUpListItem);
    return mainList;
  };

  const followUpDropDown = document.createElement("div");
  followUpDropDown.classList.add("style");
  followUpDropDown.classList.add("style_violet");
  followUpDropDown.id = "follow_up";
  followUpDropDown.appendChild(createFollowUpList());
  return followUpDropDown;
}

function createLatestGoogle() {
  const latestGoogleContentDiv = document.createElement("div");
  latestGoogleContentDiv.className = "latest_google_content";

  const subscriptionTier = getUserSubscriptionTier();
  const latestGoogleDiv = document.createElement("div");

  latestGoogleDiv.className = "latest_google";

  const latestDataDiv = document.createElement("div");
  latestDataDiv.className = "latest_data";

  const pointerEventsSpan = document.createElement("span");
  pointerEventsSpan.className =
    "pointer-events-none relative inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5 h-5 w-5";
  latestDataDiv.appendChild(pointerEventsSpan);

  const hiddenSpans = ["opacity-0", "opacity-100"].map((opacityClass) => {
    const span = document.createElement("span");
    span.className = `${opacityClass} duration-100 ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`;
    span.setAttribute("aria-hidden", "true");
    pointerEventsSpan.appendChild(span);
    return span;
  });

  const changeCategories = (isAccessArr) => (category) =>
    isAccessArr.includes(category.title) ? { ...category, isAccess: true } : { ...category, isAccess: false };

  let getCategoriesBySubscriptionTier = {
    free: [...categories].map((category) => {
      return {
        ...category,
        items: category.items.map(
          changeCategories(
            category.id === "tone-google" ? googleTonesSubscriptionTierFree : googleStylesSubscriptionTierFree
          )
        ),
      };
    }),
    tier1: categories,
    tier2: categories,
    tier3: categories,
  };
  console.log("subscriptionTier", subscriptionTier);
  const categoriesBySubscriptionTier = getCategoriesBySubscriptionTier[subscriptionTier];

  categoriesBySubscriptionTier.forEach((category) => {
    const div = document.createElement("div");
    div.classList.add("style");
    div.classList.add("style_grey");

    div.id = category.id;
    latestGoogleDiv.appendChild(div);

    // const p = document.createElement("p");
    // p.textContent = `${category.className} :`;
    // div.appendChild(p);

    const ul = document.createElement("ul");
    div.appendChild(ul);

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = localStorage.getItem(category.className) || category.name;

    if (!localStorage.getItem(category.className)) {
      localStorage.setItem(category.className, category.name);
    }

    li.appendChild(span);
    li.appendChild(createUlSFromCategory(category, category.items));
    ul.appendChild(li);
  });

  function setActiveItem(item, index) {
    const itemToActivate = `${item} ${index}`;

    categories.forEach((category) => {
      category.items.forEach((currentItem, itemIndex) => {
        if (currentItem === "Persuasive") {
          category.items[itemIndex] = itemToActivate;
          const liToUpdate = document.querySelector(`#${category.id} > ul > li`);
          liToUpdate.textContent = itemToActivate;
        }
      });
    });
  }

  while (latestGoogleDiv.firstChild) {
    latestGoogleContentDiv.appendChild(latestGoogleDiv.firstChild);
  }

  latestGoogleDiv.appendChild(latestGoogleContentDiv);

  return latestGoogleDiv;
}

function callMicro() {
  const microphoneDiv = document.getElementById("microphone");
  microphoneDiv.click();
}

function addImdInSendButton(sendButton) {
  const imgSend = document.createElement("img");
  imgSend.src = chrome.runtime.getURL("assets/images/sendIcon.svg");
  imgSend.alt = "";
  sendButton?.appendChild(imgSend);
}

function addSelectedCategoriesValueInEndTextareaValue() {
  console.log("addSelectedCategoriesValueInEndTextareaValue");
  const textArea = document.querySelector("textarea");
  categories.forEach((category) => {
    const selectedCategoryName = localStorage.getItem(category.className, category.name);

    if (selectedCategoryName === "Default") return;

    if (selectedCategoryName) {
      textArea.value += ` ${category.className}:${selectedCategoryName} `;
    }
  });
}

// function addMicrophone() {
//   console.log("addMicrophone");
//   const microphoneDiv = document.createElement("div");
//   microphoneDiv.className = "microphone";
//   microphoneDiv.id = "microphone";
//   const img = document.createElement("img");
//   img.src = chrome.runtime.getURL(`assets/images/microphone.svg`);
//   microphoneDiv.appendChild(img);
//   const textArea = document.querySelector("textarea");
//   const sendButton = document.querySelector("#global .stretch.mx-2.flex.flex-row.gap-3 .flex-grow.relative button");

//   sendButton?.addEventListener("click", () => {
//     addSelectedCategoriesValueInEndTextareaValue();
//   });

//   addImdInSendButton(sendButton);

//   $(microphoneDiv).insertAfter(sendButton);

//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   let recognition;

//   microphoneDiv.addEventListener("click", () => {
//     console.log("microphoneDiv");
//     navigator &&
//       navigator.mediaDevices
//         .getUserMedia({
//           audio: true,
//         })
//         .then(() => {
//           if (microphoneDiv.classList.contains("microphone-is-listening")) {
//             microphoneDiv.classList.remove("microphone-is-listening");
//             // recognition && recognition.stop();
//           } else {
//             microphoneDiv.classList.add("microphone-is-listening");

//             if (SpeechRecognition !== undefined && textArea) {
//               recognition = new SpeechRecognition();
//               if (localStorage.getItem("Language") && localStorage.getItem("Language") !== "Default") {
//                 let language = localStorage.getItem("Language");
//                 recognition.lang = languages[language];
//               }
//               recognition.start();

//               recognition.onresult = (result) => {
//                 console.log("result.results[0][0].transcript", result.results[0][0].transcript);
//                 textArea.value += ` ${result.results[0][0].transcript}`;
//                 // sendButton.removeAttribute("disabled");
//                 // microphoneDiv.classList.remove("microphone-is-listening");
//               };
//             }
//           }
//         })
//         .catch(() => {
//           alert("Microphone access denied");
//         });
//   });
// }

//вторая версия
// function addMicrophone() {
//   const microphoneDiv = document.createElement("div");
//   microphoneDiv.className = "microphone";
//   microphoneDiv.id = "microphone";
//   const img = document.createElement("img");
//   img.src = chrome.runtime.getURL(`assets/images/microphone.svg`);
//   microphoneDiv.appendChild(img);
//   const textArea = document.querySelector("textarea");
//   const sendButton = document.querySelector("#global .stretch.mx-2.flex.flex-row.gap-3 .flex-grow.relative button");
//   let stopRecord = false;
//   sendButton?.addEventListener("click", () => {
//     addSelectedCategoriesValueInEndTextareaValue();
//   });

//   addImdInSendButton(sendButton);

//   $(microphoneDiv).insertAfter(sendButton);

//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   let recognition;

//   function startRecognition() {
//     if (SpeechRecognition !== undefined && textArea) {
//       recognition = new SpeechRecognition();
//       if (localStorage.getItem("Language") && localStorage.getItem("Language") !== "Default") {
//         let language = localStorage.getItem("Language");

//         recognition.lang = languages[language];
//       }
//       recognition.continuous = true;
//       recognition.interimResults = true;

//       recognition.onresult = (result) => {
//         console.log("result", result);
//         const value = result.results[0][0].transcript.trim();
//         textArea.value += `${value}`;

//         if (value.toLowerCase().includes("stop")) {
//           console.log("SEND_________");
//           stopRecognition();
//           microphoneDiv.classList.remove("microphone-is-listening");
//           sendButton.removeAttribute("disabled");
//           // const enterEvent = new KeyboardEvent("keydown", {
//           //   key: "Enter",
//           //   code: "Enter",
//           //   keyCode: 13,
//           //   which: 13,
//           //   bubbles: true,
//           //   cancelable: true,
//           // });

//           // Dispatch the 'Enter' key event on the textarea
//           // textArea.focus();
//           // textArea.dispatchEvent(enterEvent);
//         }
//       };
//       recognition.onend = () => {
//         // Распознавание завершилось, перезапускаем его
//         if (!stopRecord) startRecognition();
//       };
//       recognition.start();
//     }
//   }

//   function stopRecognition() {
//     if (recognition) {
//       console.log("stopRecognition___");
//       recognition.stop();
//       recognition.onend = null; // Отключаем обработчик onend, чтобы он не перезапускал распознавание
//     }
//   }

//   microphoneDiv.addEventListener("click", () => {
//     console.log("microphoneDiv");
//     navigator &&
//       navigator.mediaDevices
//         .getUserMedia({
//           audio: true,
//         })
//         .then(() => {
//           if (microphoneDiv.classList.contains("microphone-is-listening")) {
//             console.log("stopRecognition__1");
//             microphoneDiv.classList.remove("microphone-is-listening");
//             // stopRecord = true;
//             stopRecognition();
//           } else {
//             microphoneDiv.classList.add("microphone-is-listening");
//             startRecognition();
//           }
//         })
//         .catch(() => {
//           alert("Microphone access denied");
//         });
//   });
// }
// вторая версия

function addMicrophone() {
  const microphoneDiv = document.createElement("div");
  microphoneDiv.className = "microphone";
  microphoneDiv.id = "microphone";
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL(`assets/images/microphone.svg`);
  microphoneDiv.appendChild(img);
  const textArea = document.querySelector("textarea");
  const sendButton = document.querySelector("#global .stretch.mx-2.flex.flex-row.gap-3 .flex-grow.relative button");
  let stopRecord = false;
  let lastRecognizedWord = ""; // New variable to store the last recognized word
  let lastIndex = 1;
  let isAlisa = false;

  sendButton?.addEventListener("click", () => {
    addSelectedCategoriesValueInEndTextareaValue();
  });

  addImdInSendButton(sendButton);

  $(microphoneDiv).insertAfter(sendButton);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  function startRecognition() {
    if (SpeechRecognition !== undefined && textArea) {
      recognition = new SpeechRecognition();
      if (localStorage.getItem("Language") && localStorage.getItem("Language") !== "Default") {
        let language = localStorage.getItem("Language");

        recognition.lang = languages[language];
      }
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const newIndex = event.results.length;

        let result = event.results[newIndex - 1];

        const transcript = result[0].transcript.trim();

        const recognizedWord = transcript;

        const isFinalRes = event.results[newIndex - 1]?.isFinal;
        const finalRes = event.results[newIndex - 1][0].transcript.trim();

        const recognizedWordArr = recognizedWord.toLowerCase().split(/\s+/);
        const lastRecognizedWordArr = lastRecognizedWord.toLowerCase().split(/\s+/);

        let isHasWord = recognizedWordArr.some((newWord) =>
          lastRecognizedWordArr.some((oldWord) =>
            oldWord == "" ? false : newWord.includes(oldWord) || newWord == oldWord
          )
        );

        let textAreaValueArr = textArea.value.trim().toLowerCase().split(/\s+/);

        let isTextAreaHasString = recognizedWordArr.some((newWord) =>
          textAreaValueArr.some((oldWord) => (oldWord == "" ? false : newWord.includes(oldWord) || newWord == oldWord))
        );

        if (recognizedWord.toLowerCase().includes("алиса") || isAlisa) {
          isAlisa = true;

          if (recognizedWord.toLowerCase().includes("конец записи")) {
            microphoneDiv.classList.remove("microphone-is-listening");
            sendInput(textArea?.value, true);
            recognition.stop();
            recognition.onend = null;
            recognition = null;
          }

          if (recognizedWord.toLowerCase().includes("удалить")) {
            isAlisa = false;
            textArea.value = "";
            recognition.stop();
            recognition.onend = null;
            recognition = null;

            startRecognition();
          }

          return;
        }

        if (isFinalRes) {
          for (let i = 0; event.results.length >= i; i++) {
            const finalRes = event.results[i]?.[0]?.transcript.trim();

            if (!finalRes) return;
            if (i == 0) {
              textArea.value = ` ${finalRes?.toLowerCase()} `;
            } else {
              textArea.value += ` ${finalRes?.toLowerCase()} `;
            }
          }
        } else if (recognizedWord.toLowerCase() !== lastRecognizedWord.toLowerCase() && !isHasWord) {
          lastRecognizedWord = recognizedWord;

          textArea.value += ` ${recognizedWord.toLowerCase()} `;
          lastIndex = newIndex;
        }
      };

      recognition.onend = () => {
        if (!stopRecord) {
          // startRecognition();
          recognition.start();
        }
      };

      recognition.start();
    }
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
      recognition.onend = null;
    }
  }

  microphoneDiv.addEventListener("click", () => {
    navigator &&
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(() => {
          if (microphoneDiv.classList.contains("microphone-is-listening")) {
            console.log("stopRecognition__1");
            microphoneDiv.classList.remove("microphone-is-listening");
            stopRecord = true;
            stopRecognition();
            sendInput(textArea?.value, true);
          } else {
            microphoneDiv.classList.add("microphone-is-listening");
            stopRecord = false;
            startRecognition();
          }
        })
        .catch(() => {
          alert("Microphone access denied");
        });
  });
}

function addElementGoogle() {
  const subscriptionTier = getUserSubscriptionTier();

  const latestGoogle = createLatestGoogle();

  let messageInput = document.querySelector("main > div.absolute.bottom-0.left-0.w-full.border-t > form");

  let latestGoogleContent = latestGoogle.querySelector(".latest_google_content");

  const followUpBtn = createFollowUpDiv();

  if (subscriptionTier === "free") {
    followUpBtn.classList.add("no_access_follow_up_btn");
  }

  latestGoogleContent.appendChild(followUpBtn);

  $(latestGoogle).insertAfter(messageInput);

  var ideaElement = createIdeaElement();

  if (accessSubscriptionTierForIdea.includes(subscriptionTier)) {
    ideaElement.classList.add("access_idea");
  } else {
    ideaElement.classList.add("no_access_idea");
  }

  latestGoogle.prepend(ideaElement);
}

setInterval(() => {
  let isBtnResponseChangeClassName = document.querySelector(".btn-response");

  if (!isBtnResponseChangeClassName) {
    const btnArr = ["Regenerate response", "Stop generating"];
    const elements = document.querySelectorAll("form button div");

    for (const element of elements) {
      if (btnArr.some((btnText) => btnText?.includes(element?.textContent))) {
        console.log(element.parentNode);
        const btnResponse = element.parentNode;
        btnResponse.classList.add("btn-response");
      }
    }
  }

  const element = document.querySelector(".latest_google");
  let body = document.querySelector("body");
  let isLoadedSubscription = body.classList.contains("subscription_tier_loaded");

  if (!element && isLoadedSubscription) {
    addElementGoogle();
  }
  const micro = document.querySelector(".microphone");
  if (!micro) {
    addMicrophone();
  }
}, 50);

addElementGoogle();
addMicrophone();

function handleKeyDown(e) {
  if (e.code === "KeyB" && (e.metaKey || e.ctrlKey)) {
    callMicro();
  }
}

document.addEventListener("keydown", handleKeyDown);

changeNewChatBtn();

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

function updateApp() {
  setInterval(() => {
    addLogo();
    changeNewChatBtn();
    changeLeftSideBarIcon();
    changeOpenLeftSidebar();
    changeSendButton();
  }, 100);
}

updateApp();

function changeNewChatBtn() {
  let newChatButton = document?.querySelector("nav");
  const a = newChatButton?.querySelector("a");
  const isExistSpan = a?.querySelector("span");

  if (newChatButton && a && !isExistSpan) {
    const svgClone = a.querySelector("svg").cloneNode(true);
    a.textContent = "";
    a.appendChild(svgClone);
    const span = document.createElement("span");
    span.textContent = "Add new chat";
    a.appendChild(span);

    $(a)
      .off("click")
      .on("click", () => {
        let isMenuContentActive = $(".menu_content").hasClass("active");
        if (isMenuContentActive) {
          let intervalId = null;

          intervalId = setInterval(() => {
            // console.log("_____isMenuContentActive");
            let isMenuContentActive = $(".menu_content").hasClass("active");

            if (!isMenuContentActive) {
              $("#global .flex.h-full.max-w-full.flex-1.flex-col").removeClass("active");
              clearInterval(intervalId);
            } else {
              $("#global .flex.h-full.max-w-full.flex-1.flex-col").addClass("active");
            }
          }, 200);
        }
      });
  }
}

function addLogo() {
  const nav = document?.querySelector("nav");
  const isExistLogo = nav?.querySelector(".logo_chatGpt");
  if (nav && !isExistLogo) {
    console.log("addLogo___111");
    const logo = document.createElement("div");
    logo.classList.add("logo_chatGpt");
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("assets/images/logo.svg");
    img.alt = "logo";
    logo.appendChild(img);
    const firstChild = nav.firstChild;
    nav.insertBefore(logo, firstChild);
  }
}

function changeSendButton() {
  const sendButton = document.querySelector("#global .stretch.mx-2.flex.flex-row.gap-3 .flex-grow.relative button");
  const loadBlock = sendButton?.querySelector(".text-2xl");

  const isExistClass = sendButton?.classList.contains("disabled:opacity-40");
  console.log("sendButton__________", sendButton);
  console.log("isExistClass", isExistClass);

  if (sendButton && !isExistClass) {
    // $(sendButton)
    // .off("click")
    // .on("click", function () {
    console.log("sendButton".toUpperCase(), sendButton);
    // Удаляем классы из второй строки
    sendButton.classList.remove("disabled:bottom-0.5", "md:disabled:bottom-0");

    // Добавляем классы из первой строки
    sendButton.classList.add("transition-colors", "disabled:opacity-40");
    // loadBlock.remove();
    // });
  }
}

function changeLeftSideBarIcon() {
  const leftSideBarIcon = document.querySelector(
    "#global nav .flex.p-3.gap-3.transition-colors.duration-200.text-white.cursor-pointer.text-sm.rounded-md.border.h-11.w-11.flex-shrink-0.items-center.justify-center"
  );

  if (leftSideBarIcon && leftSideBarIcon.querySelector("svg")) {
    const svg = leftSideBarIcon.querySelector("svg");
    const span = leftSideBarIcon.querySelector("span");
    svg.remove();
    const leftSideBarImg = createLeftSideBarImg();

    leftSideBarIcon.prepend(leftSideBarImg);
  }
}

function changeOpenLeftSidebar() {
  const openLeftSidebar = document.querySelector(".absolute.left-2.top-2.z-10.hidden");

  if (openLeftSidebar && openLeftSidebar.querySelector("svg")) {
    const svg = openLeftSidebar.querySelector("svg");
    svg.remove();
    const leftSideBarImg = createLeftSideBarImg();
    const button = openLeftSidebar.querySelector("button");

    button.appendChild(leftSideBarImg);
  }
}

function createLeftSideBarImg() {
  const leftSideBarImg = document.createElement("img");
  leftSideBarImg.classList.add("left_sidebar_icon");
  leftSideBarImg.src = chrome.runtime.getURL("assets/images/iconLeftSideBar.svg");
  return leftSideBarImg;
}
