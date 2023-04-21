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
    let menuContentDiscoverMore = document.createElement("a");
    menuContentDiscoverMore.className = "discover_more";
    menuContentDiscoverMore.setAttribute("href", "javascript:void(0)");

    let menuContentDiscoverMoreText = document.createTextNode("Discover more");
    menuContentDiscoverMore.appendChild(menuContentDiscoverMoreText);

    return menuContentDiscoverMore;
}

function createPurchasedPromts() {
    let menuContentPurchasedPrompts = document.createElement("a");
    menuContentPurchasedPrompts.className = "purchased_prompts";
    menuContentPurchasedPrompts.setAttribute("href", "javascript:void(0)");


    let menuContentPurchasedPromptsImg = document.createElement("img");
    menuContentPurchasedPromptsImg.src = chrome.runtime.getURL('assets/images/purchased_prompts_img.svg');
    menuContentPurchasedPromptsImg.setAttribute("alt", "");

    menuContentPurchasedPrompts.appendChild(menuContentPurchasedPromptsImg);

    let menuContentPurchasedPromptsText = document.createTextNode(" Purchased Prompts");
    menuContentPurchasedPrompts.appendChild(menuContentPurchasedPromptsText);

    return menuContentPurchasedPrompts;
}

function createContentFavorites() {
    let menuContentFavorites = document.createElement("ul");
    menuContentFavorites.className = "favourites";

    let menuContentFavoritesLi = document.createElement("li");
    let menuContentFavoritesLiImg = document.createElement("img");
    menuContentFavoritesLiImg.src = chrome.runtime.getURL('assets/images/favourites_img.svg');
    menuContentFavoritesLiImg.setAttribute("alt", "");

    menuContentFavoritesLi.appendChild(menuContentFavoritesLiImg);

    let menuContentFavoritesLiText = document.createTextNode(" Favourites");

    menuContentFavoritesLi.appendChild(menuContentFavoritesLiText);
    menuContentFavorites.appendChild(menuContentFavoritesLi);
    return menuContentFavorites;
}

function createCategory(name, itemsSize) {
    let menuContentCategoriesItems = document.createElement("ul");
    menuContentCategoriesItems.className = "items";

    let menuContentCategoriesItemsLi = document.createElement("li");

    let menuContentCategoriesItemsLiSpan = document.createElement("span");
    menuContentCategoriesItemsLiSpan.style = "background: #B4F573";

    menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiSpan);

    let menuContentCategoriesItemsLiText = document.createTextNode(name);

    menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiText);

    let menuContentCategoriesItemsLiStoryContent = document.createElement("div");

    menuContentCategoriesItemsLiStoryContent.className = "story_content";

    const menuDivText = "I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage";
    let menuDivs = [];
    for (let i = 0; i < itemsSize; i++) {
        const menuDiv = document.createElement("div");
        const menuDivP = document.createElement("p");
        menuDivP.innerText = menuDivText;
        menuDiv.appendChild(menuDivP);
        menuDivs[i] = menuDiv;
    }
    menuContentCategoriesItemsLiStoryContent.append(...menuDivs);

    menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiStoryContent);
    menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi);
    return menuContentCategoriesItems;
}

function createCategories() {
    let menuContentCategories = document.createElement("ul");
    menuContentCategories.className = "categories";

    menuContentCategories.querySelectorAll('li').forEach((category) => {
        category.addEventListener('click', () => {
            menuContentCategories.querySelectorAll('li').forEach((cat) => cat.classList.remove('active'));
            category.classList.add('active');
            filterCategory(category.innerText.trim());
        });
    });

    let menuContentCategoriesLi = document.createElement("li");
    menuContentCategoriesLi.className = "active";

    menuContentCategories.style.setProperty("--icon", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);

    let menuContentCategoriesLiImg = document.createElement("img");
    menuContentCategoriesLiImg.src = chrome.runtime.getURL('assets/images/categories_img.svg');
    menuContentCategoriesLiImg.setAttribute("alt", "");

    menuContentCategoriesLi.appendChild(menuContentCategoriesLiImg);

    let menuContentCategoriesLiText = document.createTextNode(" Categories");

    menuContentCategoriesLi.appendChild(menuContentCategoriesLiText);

    menuContentCategories.appendChild(menuContentCategoriesLi);


    menuContentCategories.appendChild(createCategory("Finance", 4));
    menuContentCategories.appendChild(createCategory("Artificial Intelligence", 0));
    menuContentCategories.appendChild(createCategory("Education", 0));
    menuContentCategories.appendChild(createCategory("Bussiness", 0));
    menuContentCategories.appendChild(createCategory("Sports", 0));

    return menuContentCategories;
}

function createContentForm() {
    let menuContentForm = document.createElement("form");
    let menuContentFormButton = document.createElement("button");
    let menuContentFormButtonImg = document.createElement("img");
    menuContentFormButtonImg.src = chrome.runtime.getURL('assets/images/search.svg');
    menuContentFormButtonImg.setAttribute("alt", "");

    menuContentFormButton.appendChild(menuContentFormButtonImg);
    menuContentForm.appendChild(menuContentFormButton);

    let menuContentFormInput = document.createElement("input");
    menuContentFormInput.setAttribute("type", "search");
    menuContentFormInput.setAttribute("placeholder", "Search...");

    menuContentFormInput.addEventListener('input', (event) => {
        searchItems(event.target.value);
    });

    menuContentForm.appendChild(menuContentFormInput);
    return menuContentForm;
}

function createMenuContent() {
    const menuContent = document.createElement("div");
    menuContent.className = "menu_content active";
    menuContent.appendChild(createContentForm());
    menuContent.appendChild(createCategories());
    menuContent.appendChild(createContentFavorites());
    menuContent.appendChild(createPurchasedPromts());
    menuContent.appendChild(createDiscoverMore());

    return menuContent;
}
document.body.appendChild(createMenuContent());

//сделать раскрытие категорий
//сделать фильтрацию по категориям
//fetch restApi promise 