const regex = /{([^}]+)}/g;

function preventSubmission(event) {
    event.preventDefault();
}

function sendInput(selected_prompt, is_disabled = false) {
    console.warn(selected_prompt);
    let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');
    let style_value = document.getElementById('style-google').childNodes[1].childNodes[0].childNodes[0].textContent;
    let language_value = document.getElementById('language-google').childNodes[1].childNodes[0].childNodes[0].textContent;
    let tone_value = document.getElementById('tone-google').childNodes[1].childNodes[0].childNodes[0].textContent;
    let prompt_text = `${selected_prompt} Style: ${style_value} Language: ${language_value} Tone: ${tone_value}`;
    $("textarea").val(prompt_text);

    if (is_disabled) {
        setTimeout(() => {
            send_button.removeAttribute('disabled');
            send_button.click();
        },1000)



    }
    // localStorage.removeItem('template');
}

document.addEventListener('readystatechange', event => {
    const textarea = document.querySelector("textarea");
    const form = document.querySelector('form');
    let textAreaState = '';

    textarea.addEventListener('change', event => {
        textAreaState = event.target.value;
    });

    textarea && textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !(event.shiftKey)) {
            if (!textarea.value) {
                textarea.value = `${textAreaState} ${localStorage.getItem('Prompt payload')}`;
            } else {
                textarea.value = `${event.target.value.trim()} ${localStorage.getItem('Prompt payload')}`;
            }
            event.preventDefault();
        }
    });

    form.addEventListener('submit', (event) => {
        if (!textarea.value) {
            textarea.value = `${textAreaState} ${localStorage.getItem('Prompt payload')}`;
        } else {
            textarea.value = `${textarea.value} ${localStorage.getItem('Prompt payload')}`;
        }
        event.preventDefault();
    });
});

function process_input() {
    let textarea = document.querySelector("textarea");
    let variable_names = textarea.value.split(",");
    let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');
    send_button.addEventListener('click', () => {
        const inputValue = textarea.value.trim();
        if (localStorage.getItem('template') && inputValue !== '') {
            let variables = textarea.value.split(",");

            // perform your action here, e.g. send the form data to the server
            console.log('Submitting the form...');
            // clear the input field and enable the form submission again
            let selected_prompt = localStorage.getItem('template');
            for (let i = 0; i < variable_names.length; i++) {
                selected_prompt = selected_prompt.replace(/{.*}/, variables[i]);
            }
            console.log(selected_prompt);
            sendInput(selected_prompt);
            textarea.value = '';
            send_button.removeEventListener('submit', preventSubmission);
            send_button.removeEventListener('click', preventSubmission);
            localStorage.removeItem('template');

        } else if (inputValue !== '') {
            console.warn('here is the input value click');
            localStorage.removeItem('template');
            sendInput(textarea.value.trim());
            textarea.value = '';
        } else {
            send_button.addEventListener('click', preventSubmission);
            send_button.removeEventListener('submit', preventSubmission);
        }
        textarea.placeholder = 'Send a message.';

    });
    textarea.addEventListener('keydown', (event) => {

        if (event.key === 'Enter') {
            const inputValue = textarea.value.trim();
            if (localStorage.getItem('template') && inputValue !== '') {
                let variables = textarea.value.split(",");
                // perform your action here, e.g. send the form data to the server
                console.log('Submitting the form...');
                // clear the input field and enable the form submission again
                let selected_prompt = localStorage.getItem('template');
                for (let i = 0; i < variable_names.length; i++) {
                    selected_prompt = selected_prompt.replace(/{.*}/, variables[i]);
                }
                console.log(selected_prompt);
                $("textarea").value = selected_prompt;
                document.querySelector("textarea").value = selected_prompt;
                // let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');
                // let style_value = document.getElementById('style-google').childNodes[1].childNodes[0].childNodes[0].textContent;
                // let tone_value = document.getElementById('tone-google').childNodes[1].childNodes[0].childNodes[0].textContent;
                // setPromptText(style_value, selected_prompt, tone_value, 5, include_google_data).then((result) => {
                //     console.log(result);
                //     //to send ready message into ChatGPT
                //     document.querySelector("textarea").value = result.prompt_text;
                //     // if (is_disabled) {
                //     //     send_button.removeAttribute('disabled');
                //     //     send_button.click();
                //     // }
                //     localStorage.removeItem('template');
                //     textarea.removeEventListener('keydown', preventSubmission);
                //     textarea.removeEventListener('submit', preventSubmission);
                //     localStorage.removeItem('template');
                //     textarea.value = '';
                //     textarea.placeholder = 'Send a message.';
                // })
            }
        } else {
            // textarea.addEventListener('keydown', preventSubmission);
            textarea.addEventListener('submit', preventSubmission);
        }
        textarea.placeholder = 'Send a message.';

    });
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
    const allItems = document.querySelectorAll('.story_content_liner div');
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
        href: "https://gotgood.ai/dashboard"
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
        class: "story_content_liner"
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
                    process_input();
                } else {
                    localStorage.setItem('template', selected_prompt);
                    sendInput(selected_prompt, true);
                }
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
        response.forEach((category) => {
            menuContentCategories.querySelector('ul').append(createCategoryElement(category.name, category.id));
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
