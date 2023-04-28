const regex = /{([^}]+)}/g;

function preventSubmission(event) {
    event.preventDefault();
}

function sendInput(selected_prompt) {
    document.querySelector("textarea").value = selected_prompt;
    let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');
    let style_value = document.getElementById('style-google').childNodes[1].childNodes[0].childNodes[0].textContent;
    let tone_value = document.getElementById('tone-google').childNodes[1].childNodes[0].childNodes[0].textContent;
    let include_google_data = document.getElementById('headlessui-switch-:rh:').getAttribute('aria-checked');
    if (include_google_data === 'true') {
        include_google_data = true;
    } else {
        include_google_data = false;
    }
    setPromptText(style_value, selected_prompt, tone_value, 5, include_google_data).then((result) => {
        console.log(result);
        document.querySelector("textarea").value = result.prompt_text;
        send_button.removeAttribute('disabled');
        send_button.click();
    })
}

function process_input() {
    let textarea = document.querySelector("textarea");
    let variable_names = textarea.value.split(",");
    let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');
    send_button.addEventListener('click', (event) => {
        alert(localStorage.getItem('template'));
        send_button.addEventListener('click', preventSubmission);
        event.preventDefault();
        if (textarea.value) {
            input_text = input_text.split(",");
            console.log(input_text);

            for (let i = 0; i < variable_names.length; i++) {
                textarea.value = textarea.value.replace(`{${variable_names[i]}}`, input_text[i]);
            }
        }
        send_button.removeEventListener('click', preventSubmission);
        send_button.removeAttribute('disabled');
        send_button.click();
    });
    // textarea.addEventListener('change', (event) => {
    //     console.log(event.key);
    //     if (event.key === 'Enter') {
    //         alert(localStorage.getItem('template'));
    //         const inputValue = textarea.value.trim();
    //         if (localStorage.getItem('template') && inputValue !== '') {
    //             // perform your action here, e.g. send the form data to the server
    //             console.log('Submitting the form...');
    //             // clear the input field and enable the form submission again
    //             let selected_prompt = localStorage.getItem('template');
    //             for (let i = 0; i < variable_names.length; i++) {
    //                 selected_prompt = selected_prompt.replace(`{${variable_names[i]}}`, input_text[i]);
    //             }
    //             textarea.value = selected_prompt;
    //             textarea.removeEventListener('keydown', preventSubmission);
    //             textarea.removeEventListener('submit', preventSubmission);
    //             send_button.click();

    //         } else {
    //             // prevent the default enter key behavior
    //             console.warn('prevent submission');
    //             event.preventDefault();
    //         }
    //     }
    // });
}

async function getCategories() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai/api/shop/get-categories/", requestOptions)
    let result = await response.json();
    console.log(result);
    return result.results;
}


async function getPromptsByCategory(categoryId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let response = await fetch(`https://gotgood.ai/api/shop/get-extension-prompt-by-category/${categoryId}`, requestOptions);
    let result = response.json();
    console.log(result);
    return result;
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
    const allItems = document.querySelectorAll('.story_content div');
    allItems.forEach((item) => {
        if (item.querySelector('p').innerText.toLowerCase().includes(searchValue.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}


function createDiscoverMore() {
    return createElem("a", {
        class: "discover_more",
        href: "javascript:void(0)"
    }, ["Discover more"]);
}


function createPurchasedPrompts() {
    const menuContentPurchasedPromptsImg = createElem("img", {
        src: chrome.runtime.getURL('assets/images/purchased_prompts_img.svg'),
        alt: ""
    }, []);

    const menuContentPurchasedPrompts = createElem("a", {
        class: "purchased_prompts",
        href: "javascript:void(0)"
    }, [
        menuContentPurchasedPromptsImg,
        " Purchased Prompts"
    ]);

    return menuContentPurchasedPrompts;
}


function createContentFavorites() {
    const menuContentFavoritesLiImg = createElem("img", {
        src: chrome.runtime.getURL('assets/images/favourites_img.svg'),
        alt: ""
    }, []);

    const menuContentFavoritesLi = createElem("li", {}, [
        menuContentFavoritesLiImg,
        " Favourites"
    ]);

    const menuContentFavorites = createElem("ul", {
        class: "favourites"
    }, [
        menuContentFavoritesLi
    ]);

    return menuContentFavorites;
}


function createCategory(id) {
    const menuContentCategoriesItems = createElem("ul", {
        class: "items"
    }, []);

    const menuContentCategoriesItemsLiSpan = createElem("span", {
        style: "background: #B4F573"
    }, []);

    const menuContentCategoriesItemsLiStoryContent = createElem("div", {
        class: "story_content"
    }, []);

    const menuDivText = "I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage";
    const menuDivs = [];
    getPromptsByCategory(id).then((response) => {
        console.log(response.length);
        for (let i = 0; i < response.length; i++) {
            const menuDivP = createElem("p", {}, [response[i].prompt_template]);
            const menuDiv = createElem("div", {
                "id": response[i].id
            }, [menuDivP]);
            menuDiv.addEventListener("click", () => {
                selected_prompt = response[i].prompt_template
                const matches = selected_prompt.match(regex);
                console.warn(matches);
                if (matches) {
                    const variables = matches.map(match => `[${match.substring(1, match.length - 1)}]`);
                    const variable_without_braces = matches.map(match => match.substring(1, match.length - 1));

                    document.querySelector("textarea").setAttribute('placeholder', variables);
                    variable_names = variable_without_braces;
                    localStorage.setItem('template', response[i].prompt_template);
                } else {
                    localStorage.removeItem('template');
                    sendInput(selected_prompt);
                }
                // process_input();
            });

            menuDivs[i] = menuDiv;
        }
        menuContentCategoriesItemsLiStoryContent.append(...menuDivs);

        const menuContentCategoriesItemsLi = createElem("li", {}, [
            menuContentCategoriesItemsLiStoryContent
        ]);

        menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi);
    });
    return menuContentCategoriesItems;
}


function createCategories() {
    const createCategoryElement = (text, id) => {
        const li = createElem("li", {
            "data-count": id
        }, [text]);
        li.addEventListener("click", () => {
            li.classList.toggle("active");
        });
        return createElem("div", {
            class: "i-category"
        }, [li, createCategory(id)]);
    };

    const menuContentCategories = createElem("ul", {
        class: "categories"
    }, []);
    menuContentCategories.style.setProperty("--icon", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);

    const menuContentCategoriesLiImg = createElem("img", {
        src: chrome.runtime.getURL("assets/images/categories_img.svg"),
        alt: ""
    }, []);

    const menuContentCategoriesLi = createElem("li", {
        class: "i-big-category"
    }, [
        menuContentCategoriesLiImg,
        " Categories"
    ]);
    menuContentCategoriesLi.onclick = () => {

        menuContentCategoriesLi.classList.toggle("active");
    }

    menuContentCategories.append(
        menuContentCategoriesLi,
        createElem("ul", {}, []));
    getCategories().then((response) => {

        console.warn(response);
        response.forEach((category) => {
            menuContentCategories.append(createCategoryElement(category.name, category.id));
        });
    });


    return menuContentCategories;
}


function createContentForm() {
    const menuContentFormButtonImg = createElem("img", {
        src: chrome.runtime.getURL('assets/images/search.svg'),
        alt: ""
    }, []);

    const menuContentFormButton = createElem("button", {}, [menuContentFormButtonImg]);

    const menuContentFormInput = createElem("input", {
        type: "search",
        placeholder: "Search..."
    }, []);

    menuContentFormInput.addEventListener('input', (event) => {
        searchItems(event.target.value);
    });

    return createElem("form", {}, [menuContentFormButton, menuContentFormInput]);
}

function createMenuContent() {
    const menuContent = createElem("div", {
        class: "menu_content"
    }, [
        createContentForm(),
        createCategories(),
        createContentFavorites(),
        createPurchasedPrompts(),
        createDiscoverMore()
    ]);

    return menuContent;
}

document.body.appendChild(createMenuContent());