const API_URL = "https://gotgood.ai";
const TOKEN = localStorage.getItem('token') || '';

// Utils functions and global state

let isLoading = false;
let selectedCategoryId;
const observers = [];

function addObserver(callback) {
  observers.push(callback);
}

function setIsLoading(value) {
  isLoading = value;
  observers.forEach(callback => {
    callback(isLoading);
  });
}

addObserver(function(isLoading) {
  const loaderWrapper = document.querySelector('.loader-wrapper');
  if (isLoading) {
    loaderWrapper && (loaderWrapper.style.display = 'flex');
  } else {
    loaderWrapper && (loaderWrapper.style.display = 'none');
  }
});

function debounce(func, delay) {
  let timeoutId;

  return function() {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      func.apply(context, args);
    }, delay);
  };
}

function formatNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixIndex = Math.floor(Math.log10(number) / 3);
    const scaledNumber = (number / Math.pow(1000, suffixIndex)).toFixed(1);

    return scaledNumber + suffixes[suffixIndex];
  }
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
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
    const regex = new RegExp(`\\[${variableName}\\]`, 'g');
    text = text.replace(regex, value);
  }
  return text;
}



async function searchPrompts(text, categoryId) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  setIsLoading(true);
  let response = await fetch(API_URL + `/api/shop/search?text=${text}&categories=${categoryId}`, requestOptions);
  setIsLoading(false);

  return await response.json();
}

async function getCategories() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
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
    var token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in localStorage');
    }
    myHeaders.append("Authorization", `token ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let response = await fetch(API_URL + "/api/chat/get-favorites/", requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

// Render functions
async function getPromptsByCategory(categoryId) {
  try {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/api/shop/get-extension-prompt-by-category/${categoryId}`);
    setIsLoading(false);
    if (!response.ok) {
      throw new Error('Failed to fetch prompts by category.');
    }
    const result = await response.json();
    console.log(result);
    return result;
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
  let send_button = document.querySelector('form > div > div > button');
  let textarea = document.querySelector("textarea");
  textarea.value = selected_prompt;

  // Create and dispatch the input event
  let event = new Event('input', {
    'bubbles': true,
    'cancelable': true
  });
  textarea.dispatchEvent(event);

  // If the button is initially disabled, remove the disabled attribute
  if (is_disabled) {
    send_button.removeAttribute('disabled');
  }

  send_button.click();
}


function processInput() {
  let input = document.querySelector("input[type='search']");
  let variable_names = input.value.split(",");
  let send_button = document.querySelector('form > div > button');

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const inputValue = input.value.trim();
      if (localStorage.getItem('template') && inputValue !== '') {
        let variables = input.value.split(",");
        let selected_prompt = localStorage.getItem('template');
        for (let i = 0; i < variable_names.length; i++) {
          selected_prompt = selected_prompt.replace(/{.*}/, variables[i]);
        }
        console.log(selected_prompt);
        input.value = selected_prompt;
        localStorage.removeItem('template');
        input.value = '';
        input.placeholder = 'Send a message.';
      }
    } else {
      input.addEventListener('submit', preventSubmission);
    }
    input.placeholder = 'Send a message.';
  });
}

function filterCategory(categoryName) {
  const allCategories = document.querySelectorAll('.categories .items');
  allCategories.forEach((category) => {
    if (categoryName === 'all' || category.querySelector('li').innerText.trim() === categoryName) {
      category.style.display = 'block';
    } else {
      category.style.display = 'none';
    }
  });
}

function searchItems(searchValue) {
  const allItems = document.querySelectorAll('.story_content_liner div');
  allItems.forEach((item) => {
    if (item.querySelector('p').innerText.toLowerCase().includes(searchValue.toLowerCase())) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function createLoader() {
  const loader = createElem('img', {
    src: chrome.runtime.getURL("assets/images/loader.gif"),
  }, []);

  return createElem('div', {
    class: 'loader-wrapper'
  }, [loader]);
}

function createCategory(id) {
  const categoryItems = createElem("ul", {
    class: "items"
  }, []);

  getPromptsByCategory(id).then((response) => {
    console.log(response.length);
    for (let i = 0; i < response.length; i++) {
      const promptParagraph = createElem("p", {}, [response[i].prompt_template]);
      const promptDiv = createElem("div", {
        "id": response[i].id,
        "class": "answer"
      }, [promptParagraph]);
      promptDiv.addEventListener("click", () => {
        const selected_prompt = response[i].prompt_template;
        const matches = selected_prompt.match(regex);
        console.warn(matches);
        if (matches) {
          const variables = matches.map(match => `[${match.substring(1, match.length - 1)}]`);
          const variable_without_braces = matches.map(match => match.substring(1, match.length - 1));
          document.querySelector("input[type='search']").setAttribute('placeholder', variables);
          variable_names = variable_without_braces;
          localStorage.setItem('template', response[i].prompt_template);
          processInput();
        } else {
          localStorage.setItem('template', selected_prompt);
          console.log(selected_prompt);
          sendInput(selected_prompt, true);
        }
      });

      categoryItems.appendChild(promptDiv);
    }
  }).catch((error) => {
    console.error(error);
  });

  return categoryItems;
}


async function createMenuContent() {
  const menuContent = createElem("div", {
    class: "menu_content"
  }, [
    createElem("div", {}, [
      createElem("h2", {}, ["Prompt bar"]),
      createRegistration(),
      await createPromptBar(),
    ]),
  ]);

  return menuContent;
}

async function createSignedMenuContent() {

  const menuButton= createElem("a", {
      class: "menu",
  },[
      createElem("img", {
          src: chrome.runtime.getURL('assets/images/menu.svg')
      },[])
  ])

  menuButton.addEventListener("click", () => {
  
    const menuContent = document.querySelector('.menu_content');
    const headerGlobal = document.querySelector('.header_global');
    const global = document.querySelector('#global .flex.h-full.max-w-full.flex-1.flex-col');

    menuContent.classList.remove('active');
    headerGlobal.classList.remove('active');
    global.classList.remove('active');

  });

  
const menuContent = createElem("div", {
  class: "menu_content"
}, [
  createElem("div", {}, [
    menuButton,
    createElem("h2", {}, ["Prompt bar"]),
    await createPromptBar(),
  ]),
]);

return menuContent;
}


function createRegistration() {
  const signUpLink = createElem("a", {
    class: "sign_up sign_up_js",
    href: "javascript:void(0)"
  }, ["Sign Up"]);

  const orText = createElem("span", {}, ["or"]);

  const signInLink = createElem("a", {
    class: "sign_in sign_in_js",
    href: "javascript:void(0)"
  }, ["Sign In"]);

  const registration = createElem("div", {
    class: "registration active"
  }, [signUpLink, orText, signInLink]);

  return registration;
}

function createSearch() {
  const searchInput = createElem("input", {
    type: "search",
    placeholder: "Search",
  }, []);

  async function processInput(e) {
    const promptsResult = await searchPrompts(e.target.value, selectedCategoryId || 1);

    createPrompts(promptsResult?.results || []);
  }

  const debouncedProcessInput = debounce(processInput, 500);

  searchInput.addEventListener('input', debouncedProcessInput);

  let searchIcon = createElem("img", {
    src: chrome.runtime.getURL("assets/images/search.svg"),
  }, []);
  let searchButton = createElem("button", {}, [searchIcon]);

  const form = createElem("form", {}, [searchButton, searchInput]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  return form;
}

function createCategoryMenu(categories) {
  let filterImage = createElem("img", {
    src: categories[0].icon,
  }, []);
  let filterText = createElem("span", {
    data: categories[0].id,
  }, []);
  filterText.textContent = categories[0].name;
  let filterTitle = createElem("div", {
    class: "filter_title"
  }, [filterImage, filterText]);
  let filterDrop = createElem("ul", {
    class: "filter_drop"
  }, []);

  filterDrop.addEventListener('click', async (e) => {
    if (e.target.tagName === 'LI') {
      const categoryId = parseInt(e.target.getAttribute('data'));
      selectedCategoryId = categoryId;
      const promptsResponse = await getPromptsByCategory(categoryId);

      const { name: newTitleName } = categories.find(({ id }) => id === categoryId);
      document.querySelector('.filter_title span').textContent = newTitleName;

      createPrompts(promptsResponse);
    }
  });

  for (let i = 0; i < categories.length; i++) {
    let filterDropItem = createElem("li", {
      data: categories[i].id,
    }, []);

    filterDropItem.textContent = categories[i].name;
    filterDrop.appendChild(filterDropItem);
  }
  let filterElem = createElem("div", {
    class: "filter"
  }, [filterTitle, filterDrop]);
  return filterElem;
}

function createSinglePrompt(promptObj) {
  let link = createElem("a", {
    href: "javascript:void(0)",
    class: "prompt_popup_js"
  }, []);
  let category = createElem("span", {
    class: "designation"
  }, []);
  category.textContent = promptObj.name;
  let title = createElem("h3", {}, []);
  title.textContent = promptObj.name;
  let description = createElem("p", {}, []);
  description.textContent = promptObj.description;

  let likeIcon = createElem("img", {
    src: chrome.runtime.getURL("assets/images/thumbs-up.svg"),
  }, []);

  let viewIcon = createElem("img", {
    src: chrome.runtime.getURL("assets/images/eye.svg"),
  }, []);

  let views = createElem("li", {}, [
    viewIcon,
  ]);
  views.textContent += ' ' + promptObj.amount_of_lookups;
  let likes = createElem("li", {}, [
    likeIcon,
  ]);
  likes.textContent += ' ' + promptObj.like_amount;
  let stats = createElem("ul", {
    class: "stats"
  }, [likes, views]);

  likeIcon = createElem("img", {
    src: chrome.runtime.getURL("assets/images/like.svg"),
  }, []);
  let likeHoverIcon = createElem("img", {
    src: chrome.runtime.getURL("assets/images/like_hover.svg"),
    class: "hover",
  }, []);
  let likeLi = createElem("li", {
    class: promptObj.is_liked ? "active" : ""
  }, [likeIcon, likeHoverIcon]);


  likeLi.addEventListener("click", function (e) {
    e.stopPropagation();

        if (likeLi.classList.contains("active")) {
            likeLi.classList.remove("active");
            likeLi.remove()

            likeIcon.classList.remove("hover")

            let likeLi = createElem("li", {
                class: ""
            }, [likeIcon,likeHoverIcon]);
            
        } else {
            likeLi.remove()
            likeIcon.classList.add("hover")

             let likeLi = createElem("li", {
                class: "active"
            }, [likeIcon,likeHoverIcon]);
        }});


        let favouriteIcon = createElem("img", {
          src: chrome.runtime.getURL("assets/images/selected.svg"),
      }, []);
  
      let favouriteHoverIcon = createElem("img", {
          src: chrome.runtime.getURL("assets/images/selected_hover.svg"),
          class: "hover"
      }, []);
  
      let favouriteLi = createElem("li", {
          class: promptObj.is_liked? "active" : ""
      }, [favouriteIcon,favouriteHoverIcon]);
  
  
      
      favouriteLi.addEventListener("click", function (e) {
          e.stopPropagation();
          console.log("click____");
  
          if (favouriteLi.classList.contains("active")) {
              console.log("active");
  
              favouriteLi.remove();
              let favouriteLi = createElem("li", {
                  class:""
              }, [favouriteIcon,favouriteHoverIcon]);
          
              
          } else {
              console.log("active2");            
              favouriteLi.remove();
              let favouriteLi = createElem("li", {
                  class:"active"
              }, [favouriteIcon,favouriteHoverIcon]);
          
          }
      });

      
  let selected = createElem("ul", {
    class: "selected"
  }, [likeLi, favouriteLi]);

  return createElem("div", {
    class: "answer"
  }, [link, category, title, description, stats, selected]);
}

async function createPromptBar() {
  const categoriesResponse = await getCategories();
  const promptsResponse = await getPromptsByCategory(categoriesResponse?.results[0]?.id);

  let promptBarContent = createElem("div", {
    class: "drop_content"
  }, []);

  createPrompts(promptsResponse, promptBarContent)

  let promptItemContent = createElem("div", {
    class: "promt_item_content"
  }, [promptBarContent]);
  let promptsCategoriesDiv = createElem("div", {
    class: "categories promt_item active"
  }, [createCategoryMenu(categoriesResponse?.results || []), promptItemContent]);
  let promptBar = createElem("div", {
    class: "promt_bar"
  }, [createSearch(), promptsCategoriesDiv]);
  return promptBar;
}

function createPrompts(prompts, parent) {
  const promptsWrapper = document.querySelector('.drop_content') || parent;

  while (promptsWrapper.firstChild) {
    promptsWrapper.removeChild(promptsWrapper.firstChild);
  }

  const onShowPromptPopupById = (prompt) => () => {
    document.body.appendChild(createPromptDetailsPopup(prompt));
  };

  for (let i = 0; i < prompts.length; i++) {
    let prompt = createSinglePrompt(prompts[i]);
    const promptId = prompts[i].id;

    prompt.addEventListener('click', () => {
      onShowPromptPopupById(prompts[i])()
    });

    promptsWrapper.appendChild(prompt);
  }
}

function createPromptDetailsPopup({ name, description, amount_of_lookups, like_amount, inputs, prompt_template }) {
  const modalState = deepClone(inputs); // [{variable_name: "variable2", placeholder: "variable2", value: "some value"}] as example

  const popup = document.createElement('div');
  popup.classList.add('popup', 'prompt_details_popup', 'active');

  const closeSpan = document.createElement('span');
  closeSpan.classList.add('close');
  popup.appendChild(closeSpan);

  const popupContent = document.createElement('div');
  popupContent.classList.add('popup_content');
  popup.appendChild(popupContent);

  const closePopupSpan = document.createElement('span');
  closePopupSpan.classList.add('close_popup');
  popupContent.appendChild(closePopupSpan);

  const closeImg = document.createElement('img');
  closeImg.src = chrome.runtime.getURL('assets/images/close.svg');
  closeImg.alt = '';

  closeImg.addEventListener('click', () => {
    document.body.removeChild(popup);
  });

  closePopupSpan.appendChild(closeImg);


  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title');
  popupContent.appendChild(titleDiv);

  const titleHeading = document.createElement('h5');
  titleHeading.textContent = 'Prompt details';
  titleDiv.appendChild(titleHeading);

  const promptPopupContentDiv = document.createElement('div');
  promptPopupContentDiv.classList.add('prompt_popup_content');
  popupContent.appendChild(promptPopupContentDiv);

  const tabPromptContentDiv = document.createElement('div');
  tabPromptContentDiv.classList.add('tab_prompt_content');
  promptPopupContentDiv.appendChild(tabPromptContentDiv);

  const answerDiv = document.createElement('div');
  answerDiv.classList.add('answer');
  tabPromptContentDiv.appendChild(answerDiv);

  const answerHeading = document.createElement('h3');
  answerHeading.textContent = name;
  answerDiv.appendChild(answerHeading);

  const answerPara1 = document.createElement('p');
  answerPara1.textContent = description;
  answerDiv.appendChild(answerPara1);

  const statsList = document.createElement('ul');
  statsList.classList.add('stats');
  answerDiv.appendChild(statsList);

  const statsItem1 = document.createElement('li');
  const statsItem1Img = document.createElement('img');
  statsItem1Img.src = 'assets/images/thumbs-up.svg';
  statsItem1Img.alt = '';
  statsItem1.appendChild(statsItem1Img);
  statsItem1.appendChild(document.createTextNode(formatNumber(amount_of_lookups)));
  statsList.appendChild(statsItem1);

  const statsItem2 = document.createElement('li');
  const statsItem2Img = document.createElement('img');
  statsItem2Img.src = 'assets/images/eye.svg';
  statsItem2Img.alt = '';
  statsItem2.appendChild(statsItem2Img);
  statsItem2.appendChild(document.createTextNode(formatNumber(like_amount)));
  statsList.appendChild(statsItem2);

  const contentTopicDiv = document.createElement('div');
  contentTopicDiv.classList.add('content_topic');
  promptPopupContentDiv.appendChild(contentTopicDiv);

  const form = document.createElement('form');

  form.addEventListener('submit', async (event) => {
    form.checkValidity();
    console.log('form submit', event);
    event.preventDefault();
  });

  contentTopicDiv.appendChild(form);


  function createInput(labelText, inputType, placeholder, onValueChange, inputValue) {
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('input');

    const inputLabel = document.createElement('label');
    inputLabel.textContent = labelText;
    inputDiv.appendChild(inputLabel);

    const input = document.createElement('input');
    input.type = inputType;
    input.placeholder = placeholder;
    input.required = true;
    input.value = null;
    input.name = labelText;
    input.addEventListener('input', onValueChange);
    inputDiv.appendChild(input);

    return inputDiv;
  }

  const handleInputValueChange = (e) => {
    const index = modalState.findIndex(({ variable_name }) => variable_name === e.target.name);
    modalState[index].value = e.target.value;
  }

  inputs.forEach(({ variable_name, placeholder }) => {
    const inputDiv = createInput(variable_name, 'text', placeholder, handleInputValueChange);
    form.appendChild(inputDiv);
  });

  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('bottom');
  popupContent.appendChild(bottomDiv);

  const sendBtn = document.createElement('button');
  sendBtn.classList.add('use_prompt');
  sendBtn.textContent = 'Send prompt';

  sendBtn.addEventListener('click', (e) => {
    const isValid = form.checkValidity();
    console.log('isValid', isValid);
    if (!isValid) {
      form.reportValidity();
    } else {
      document.body.removeChild(popup);
      sendInput(replaceVariables(modalState, prompt_template));
    }
  });

  bottomDiv.appendChild(sendBtn);

  return popup;
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
      const categoryContainer = document.querySelector('.categories .promt_item_content .drop_content');
      categoryContainer.appendChild(categoryItems);
    }
    await getFavorites();
    document.querySelector('.promt_bar').appendChild(createLoader());
  });
}

if (!localStorage.getItem('token')) {
  init();
} else {
  createSignedMenuContent().then((children) => {
    document.body.appendChild(children);
    const promptBarElement = document.querySelector('.promt_bar');
    if (promptBarElement) {
      promptBarElement.classList.add('active');
      promptBarElement.appendChild(createLoader());
    }
  });
}
