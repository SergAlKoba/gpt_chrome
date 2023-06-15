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
            createPromtBar(),]),
    ]);

    return menuContent;
}

function createSignedMenuContent() {
    const menuContent = createElem("div", {
        class: "menu_content"
    }, [
        createElem("div", {}, [
            createElem("h2", {}, ["Prompt bar"]),
            createPromtBar(),]),
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

function createPromtBar() {
    let categoriesPromtItem = createElem("div", {
        class: "categories promt_item"
    }, [
        createElem("div", {
            class: "item_nav"
        }, [
            createElem("img", {
                src: chrome.runtime.getURL("assets/images/categories_img.svg"),
                alt: ""
            }),
            " Categories"
        ]),
        createElem("div", {
            class: "promt_item_content"
        }, [
            createElem("div", {
                class: "filter"
            }, [
                createElem("div", {
                    class: "filter_title"
                }, [
                    createElem("img", {
                        src: chrome.runtime.getURL("assets/images/plants.svg"),
                        alt: ""
                    }),
                    createElem("span", {}, ["Plants"])
                ]),
                createElem("ul", {
                    class: "filter_drop"
                }, [
                    createElem("li", {}, [
                        createElem("img", {
                            src: chrome.runtime.getURL("assets/images/finance.svg"),
                            alt: ""
                        }),
                        createElem("span", {}, ["Finance"])
                    ]),
                    createElem("li", {}, [
                        createElem("img", {
                            src: chrome.runtime.getURL("assets/images/plants.svg"),
                            alt: ""
                        }),
                        createElem("span", {}, ["Plants"])
                    ]),
                    createElem("li", {}, [
                        createElem("img", {
                            src: chrome.runtime.getURL("assets/images/technology.svg"),
                            alt: ""
                        }),
                        createElem("span", {}, ["Technology"])
                    ]),
                    createElem("li", {}, [
                        createElem("img", {
                            src: chrome.runtime.getURL("assets/images/car.svg"),
                            alt: ""
                        }),
                        createElem("span", {}, ["Car"])
                    ])
                ])
            ]),
            createElem("div", {
                class: "drop_content"
            }, [
                createElem("div", {
                    class: "answer"
                }, [
                    createElem("span", {
                        class: "designation"
                    }, ["Plants"]),
                    createElem("h3", {}, ["What Happens If I Don't Give My Plants Nutrients?"]),
                    createElem("p", {}, ["With any plant or animal in the world, both macro and micronutrients are needed to thrive. Plants themselves need about 20 nutrients. These nutrients are the fuel for producing awesome cannabis plants."]),
                    createElem("p", {}, [
                        createElem("span", {}, ["Who is the cannabis breeder Mephisto Genetics?"])
                    ]),
                    createElem("ul", {
                        class: "stats"
                    }, [
                        createElem("li", {}, [
                            createElem("img", {
                                src: chrome.runtime.getURL("assets/images/thumbs-up.svg"),
                                alt: ""
                            }),
                            " 210.31K"
                        ]),
                        createElem("li", {}, [
                            createElem("img", {
                                src: chrome.runtime.getURL("assets/images/eye.svg"),
                                alt: ""
                            }),
                            " 12.4K"
                        ])
                    ])
                ]),
                createElem("div", {
                    class: "answer"
                }, [
                    createElem("span", {
                        class: "designation"
                    }, ["Plants"]),
                    createElem("h3", {}, ["Cannabis plants need what?"]),
                    createElem("p", {}, ["With any plant or animal in the world, both macro."]),
                    createElem("ul", {
                        class: "stats"
                    }, [
                        createElem("li", {}, [
                            createElem("img", {
                                src: chrome.runtime.getURL("assets/images/thumbs-up.svg"),
                                alt: ""
                            }),
                            " 210.31K"
                        ]),
                        createElem("li", {}, [
                            createElem("img", {
                                src: chrome.runtime.getURL("assets/images/eye.svg"),
                                alt: ""
                            }),
                            " 12.4K"
                        ])
                    ])
                ])
            ])
        ])
    ]);
    let favoritesPromtItem = createElem("div", {
        class: "favourites promt_item"
    }, [
        createElem("div", {
            class: "item_nav"
        }, [
            createElem("img", {
                src: chrome.runtime.getURL("assets/images/favourites_img.svg"),
                alt: ""
            }),
            " Favourites"
        ])
    ]);
    
    
    const promtBar = createElem("div", {
        class: "promt_bar"
    }, [
        createElem("form", {}, [
            createElem("button", {}, [
                createElem("img", {
                    src: chrome.runtime.getURL("assets/images/search.svg"),
                    alt: ""
                })
            ]),
            createElem("input", {
                type: "search",
                placeholder: "Search..."
            })
        ]),
        favoritesPromtItem,
        categoriesPromtItem
    ]);

    return promtBar;
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
