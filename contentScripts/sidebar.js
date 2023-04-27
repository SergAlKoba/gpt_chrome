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
    let result = await response.json();
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
            const menuDivP = createElem("p", {}, ["text"]);
            const menuDiv = createElem("div", {}, [menuDivP]);
            menuDivs[i] = menuDiv;
        }
        menuContentCategoriesItemsLiStoryContent.append(...menuDivs);
    
            const menuContentCategoriesItemsLi = createElem("li", {}, [
                menuContentCategoriesItemsLiStoryContent
            ]);
    
            menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi);
            return menuContentCategoriesItems;
    });
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
        createElem("ul", {}, [
            // createCategoryElement("Finance", 2),
            // createCategoryElement("Artificial Intelligence", 1),
            // createCategoryElement("Education", 1),
            // createCategoryElement("Bussiness", 0),
            // createCategoryElement("Sports", 0)
        ]));
    getCategories().then((response) => {

        console.warn(response);
        response.forEach((category) => {
            menuContentCategories.append(createCategoryElement(category.name, category.id));
        });
    })


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