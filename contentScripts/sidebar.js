const API_URL = "https://gotgood.ai";
const TOKEN = localStorage.getItem('token') || '';

async function getCategories() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    let response = await fetch(API_URL + "/api/shop/get-categories/", requestOptions);
    let result = await response.json();
    console.log(result);
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




async function getPromptsByCategory(categoryId) {
    try {
        const response = await fetch(`${API_URL}/api/shop/get-extension-prompt-by-category/${categoryId}`);
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


function createMenuContent() {
    const menuContent = createElem("div", {
        class: "menu_content"
    }, [
        createElem("div", {}, [
            createElem("h2", {}, ["Prompt bar"]),
            createRegistration(),
            createPromptBar(),]),
    ]);

    return menuContent;
}

function createSignedMenuContent() {
    const menuContent = createElem("div", {
        class: "menu_content"
    }, [
        createElem("div", {}, [
            createElem("h2", {}, ["Prompt bar"]),
            createPromptBar(),]),
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
    let searchIcon = createElem("img", {
        src: chrome.runtime.getURL("assets/images/search.svg"),
    }, []);
    let searchButton = createElem("button", {}, [searchIcon]);
    return createElem("form", {
    }, [searchButton, searchInput]);
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
    for (let i = 1; i < categories.length; i++) {
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
    }, []);
    let likeLi = createElem("li", {
        class: promptObj.is_liked? "active" : ""
    }, [likeIcon, likeHoverIcon]);
    let favouriteIcon = createElem("img", {
        src: chrome.runtime.getURL("assets/images/like.svg"),
    }, []);
    let favouriteHoverIcon = createElem("img", {
        src: chrome.runtime.getURL("assets/images/like_hover.svg"),
    }, []);
    let favouriteLi = createElem("li", {
        class: promptObj.is_liked? "active" : ""
    }, [favouriteIcon, favouriteHoverIcon]);
    let selected = createElem("ul", {
        class: "selected"
    },[likeLi, favouriteLi]);

    return createElem("div", {
        class: "answer"
    }, [link, category, title, description, stats, selected]);
}

function createPromptBar() {
    let prompts = [
        {
            "id": 2,
            "steps": [],
            "categories": [
                {
                    "id": 1,
                    "name": "finance"
                },
                {
                    "id": 2,
                    "name": "architecture"
                }
            ],
            "is_favourite": false,
            "like_amount": 0,
            "is_liked": false,
            "creator": {
                "pk": 1,
                "avatar": null,
                "username": "root"
            },
            "name": "second prompt",
            "description": "second prompt without steps",
            "created_at": "2023-06-01T13:56:30.919341",
            "amount_of_lookups": 0,
            "prompt_template": "second prompt without steps {variable}",
            "click_amount": 0
        }
    ];
    let categories = [
        {
            "id": 1,
            "name": "finance",
            "icon": null
        },
        {
            "id": 2,
            "name": "architecture",
            "icon": null
        },
        {
            "id": 3,
            "name": "Writing",
            "icon": null
        }
    ];

    let promptBarContent = createElem("div", {
        class: "drop_content"
    }, []);
    for (let i = 0; i < prompts.length; i++) {
        let prompt = createSinglePrompt(prompts[i]);
        promptBarContent.appendChild(prompt);
    }
    let promptItemContent = createElem("div", {
        class: "promt_item_content"
    }, [promptBarContent]);
        let promptsCategoriesDiv = createElem("div", {
        class: "categories promt_item active"
    }, [createCategoryMenu(categories), promptItemContent]);
    let promptBar = createElem("div", {
        class: "promt_bar"
    },[createSearch(), promptsCategoriesDiv]);
    return promptBar;
}

async function init() {
    document.body.appendChild(createMenuContent());
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
}
if (!localStorage.getItem('token')) {
    init();
} else {
    document.body.appendChild(createSignedMenuContent());
    const promptBarElement = document.querySelector('.promt_bar');
    if (promptBarElement) {
        promptBarElement.classList.add('active');
    }
}
