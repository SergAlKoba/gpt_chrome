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

    menuContentForm.appendChild(menuContentFormInput);
    return menuContentForm;
}

const menuContent = document.createElement("div");
function createMenuContent() {
    menuContent.className = "menu_content active";
    menuContent.appendChild(createContentForm());
}
createMenuContent();



let menuContentCategories = document.createElement("ul");
menuContentCategories.className = "categories";

let menuContentCategoriesLi = document.createElement("li");
menuContentCategoriesLi.className = "active";

let menuContentCategoriesLiImg = document.createElement("img");
menuContentCategoriesLiImg.src = chrome.runtime.getURL('assets/images/categories_img.svg');
menuContentCategoriesLiImg.setAttribute("alt", "");

menuContentCategoriesLi.appendChild(menuContentCategoriesLiImg);

let menuContentCategoriesLiText = document.createTextNode(" Categories");

menuContentCategoriesLi.appendChild(menuContentCategoriesLiText);

menuContentCategories.appendChild(menuContentCategoriesLi);

let menuContentCategoriesItems = document.createElement("ul");
menuContentCategoriesItems.className = "items";

let menuContentCategoriesItemsLi = document.createElement("li");

let menuContentCategoriesItemsLiSpan = document.createElement("span");
menuContentCategoriesItemsLiSpan.style = "background: #B4F573";

menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiSpan);

let menuContentCategoriesItemsLiText = document.createTextNode(" Finance");

menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiText);

let menuContentCategoriesItemsLiStoryContent = document.createElement("div");

menuContentCategoriesItemsLiStoryContent.className = "story_content";

const menuDivText = "I'm trying to improve my financial situation, but I'm not sure where to start. Can you give me some advice on how to manage my manage manage";
let menuDivs = [];
for (let i = 0; i < 4; i++) {
    const menuDiv = document.createElement("div");
    const menuDivP = document.createElement("p");
    menuDivP.innerText = menuDivText;
    menuDiv.appendChild(menuDivP);
    menuDivs[i] = menuDiv;
}
menuContentCategoriesItemsLiStoryContent.append(...menuDivs);

menuContentCategoriesItemsLi.appendChild(menuContentCategoriesItemsLiStoryContent);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi);



let menuContentCategoriesItemsLi2 = document.createElement("li");
let menuContentCategoriesItemsLi2Span = document.createElement("span");

menuContentCategoriesItemsLi2Span.style = "background: #FFA959";

menuContentCategoriesItemsLi2.appendChild(menuContentCategoriesItemsLi2Span);

let menuContentCategoriesItemsLi2Text = document.createTextNode(" Artificial Intelligence");

menuContentCategoriesItemsLi2.appendChild(menuContentCategoriesItemsLi2Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi2);



let menuContentCategoriesItemsLi3 = document.createElement("li");
let menuContentCategoriesItemsLi3Span = document.createElement("span");

menuContentCategoriesItemsLi3Span.style = "background: #59FFE1";

menuContentCategoriesItemsLi3.appendChild(menuContentCategoriesItemsLi3Span);

let menuContentCategoriesItemsLi3Text = document.createTextNode(" Education");

menuContentCategoriesItemsLi3.appendChild(menuContentCategoriesItemsLi3Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi3);


let menuContentCategoriesItemsLi4 = document.createElement("li");
let menuContentCategoriesItemsLi4Span = document.createElement("span");

menuContentCategoriesItemsLi4Span.style = "background: #8B9D64";

menuContentCategoriesItemsLi4.appendChild(menuContentCategoriesItemsLi4Span);

let menuContentCategoriesItemsLi4Text = document.createTextNode(" Bussiness");

menuContentCategoriesItemsLi4.appendChild(menuContentCategoriesItemsLi4Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi4);



let menuContentCategoriesItemsLi5 = document.createElement("li");
let menuContentCategoriesItemsLi5Span = document.createElement("span");

menuContentCategoriesItemsLi5Span.style = "background: #8E649D";

menuContentCategoriesItemsLi5.appendChild(menuContentCategoriesItemsLi5Span);

let menuContentCategoriesItemsLi5Text = document.createTextNode(" Sports");

menuContentCategoriesItemsLi5.appendChild(menuContentCategoriesItemsLi5Text);
menuContentCategoriesItems.appendChild(menuContentCategoriesItemsLi5);



menuContentCategories.appendChild(menuContentCategoriesItems);
menuContent.appendChild(menuContentCategories);

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
menuContent.appendChild(menuContentFavorites);

let menuContentPurchasedPrompts = document.createElement("a");
menuContentPurchasedPrompts.className = "purchased_prompts";
menuContentPurchasedPrompts.setAttribute("href", "javascript:void(0)");


let menuContentPurchasedPromptsImg = document.createElement("img");
menuContentPurchasedPromptsImg.src = chrome.runtime.getURL('assets/images/purchased_prompts_img.svg');
menuContentPurchasedPromptsImg.setAttribute("alt", "");

menuContentPurchasedPrompts.appendChild(menuContentPurchasedPromptsImg);

let menuContentPurchasedPromptsText = document.createTextNode(" Purchased Prompts");
menuContentPurchasedPrompts.appendChild(menuContentPurchasedPromptsText);
menuContent.appendChild(menuContentPurchasedPrompts);

let menuContentDiscoverMore = document.createElement("a");
menuContentDiscoverMore.className = "discover_more";
menuContentDiscoverMore.setAttribute("href", "javascript:void(0)");

let menuContentDiscoverMoreText = document.createTextNode("Discover more");
menuContentDiscoverMore.appendChild(menuContentDiscoverMoreText);

menuContent.appendChild(menuContentDiscoverMore);

document.body.appendChild(menuContent);