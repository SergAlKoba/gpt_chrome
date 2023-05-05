document.querySelector(':root').style.setProperty("--followUpCaretDown", `url(${chrome.runtime.getURL("assets/images/follow_up_CaretDown.svg")})`);
document.querySelector(':root').style.setProperty("--toneCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);
document.querySelector(':root').style.setProperty("--styleCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);

const googleStyles = [
    { title: 'Descriptive 1', name: 'name 1' },
    { title: 'Descriptive 2', name: 'name 2' },
    { title: 'Descriptive 3', name: 'name 3' },
    { title: 'Descriptive 4', name: 'name 4' },
    { title: 'Descriptive 5', name: 'name 5' },
    { title: 'Descriptive 6', name: 'name 6' }
];
const googleTones = [
    { title: 'Persuasive 1', name: 'name 1' },
    { title: 'Persuasive 2', name: 'name 2' },
    { title: 'Persuasive 3', name: 'name 3' },
    { title: 'Persuasive 4', name: 'name 4' },
    { title: 'Persuasive 5', name: 'name 5' },
    { title: 'Persuasive 6', name: 'name 6' }
];

const categories = [
    { id: 'tone-google', name: 'Persuasive', items: googleTones, className: 'Tone' },
    { id: 'style-google', name: 'Descriptive', items: googleStyles, className: 'Style' },
];

const followUpItems = [
    'Make this more consistent',
    'Tell me more about this',
    'Expand details',
    'Give me better suggestions',
    'Wrap this up',
];

function createUlFromItems(items) {
    const ul = document.createElement('ul');

    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title;
        li.onclick = function () {
            itemClickHandler(item, li);
        };
        ul.appendChild(li);
    });

    return ul;
}

function itemClickHandler(item, li) {
    console.log('Clicked:', item.title, 'Name:', item.name);
    li.parentElement.parentElement.querySelector('span').textContent = item.title;
}



const createElem = (tag, attributes, children) => {
    const elem = document.createElement(tag);

    for (const key in attributes) {
        elem.setAttribute(key, attributes[key]);
    }

    children.forEach(child => {
        if (typeof child === 'string') {
            elem.appendChild(document.createTextNode(child));
        } else {
            elem.appendChild(child);
        }
    });

    return elem;
};

function createFollowUpDiv() {
    const createListItem = (text) => {
        const li = document.createElement('li');
        li.textContent = text;
        li.onclick = () => {
            const userInput = document.querySelector('form  textarea');
            userInput.value = text;
            const submitButton = userInput.parentElement.querySelector('button');
            submitButton.disabled = false;
            submitButton.click();

        };
        return li;

    };

    const createList = (items) => {
        const ul = document.createElement('ul');
        items.forEach((item) => {
            ul.appendChild(createListItem(item));
        });
        return ul;
    };

    const createFollowUpList = () => {

        const followUpList = createList(followUpItems);
        const followUpListItem = document.createElement('li');
        followUpListItem.textContent = 'Follow up';
        followUpListItem.appendChild(followUpList);
        const mainList = document.createElement('ul');
        mainList.appendChild(followUpListItem);
        return mainList;
    };

    const div = document.createElement('div');
    div.classList.add('follow_up');
    div.appendChild(createFollowUpList());
    return div;
}

function createLatestGoogle() {

    const latestGoogleDiv = document.createElement('div');
    latestGoogleDiv.className = 'latest_google';

    const latestDataDiv = document.createElement('div');
    latestDataDiv.className = 'latest_data';
    latestGoogleDiv.appendChild(latestDataDiv);

    const infoSpan = document.createElement('span');
    infoSpan.className = 'info';
    latestDataDiv.appendChild(infoSpan);

    const infoImg = document.createElement('img');
    infoImg.src = chrome.runtime.getURL('assets/images/Info.svg');
    infoImg.alt = '';
    infoSpan.appendChild(infoImg);

    const includeLatestGoogleData = document.createElement('p');
    includeLatestGoogleData.textContent = 'Include latest google data';
    latestDataDiv.appendChild(includeLatestGoogleData);

    const button = document.createElement('button');
    button.className = 'bg-green-600 relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 h-6 w-11';
    button.id = 'headlessui-switch-:rh:';
    button.role = 'switch';
    button.type = 'button';
    button.tabIndex = '0';
    button.setAttribute('aria-checked', 'true');
    button.setAttribute('data-headlessui-state', 'checked');
    latestDataDiv.appendChild(button);

    const srOnlySpan = document.createElement('span');
    srOnlySpan.className = 'sr-only';
    srOnlySpan.textContent = 'Use setting';
    button.appendChild(srOnlySpan);

    const pointerEventsSpan = document.createElement('span');
    pointerEventsSpan.className = 'pointer-events-none relative inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5 h-5 w-5';
    button.appendChild(pointerEventsSpan);

    const hiddenSpans = ['opacity-0', 'opacity-100'].map(opacityClass => {
        const span = document.createElement('span');
        span.className = `${opacityClass} duration-100 ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`;
        span.setAttribute('aria-hidden', 'true');
        pointerEventsSpan.appendChild(span);
        return span;
    });



    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = category.className.toLowerCase();
        div.id = category.id;
        latestGoogleDiv.appendChild(div);

        const p = document.createElement('p');
        p.textContent = `${category.className} :`;
        div.appendChild(p);

        const ul = document.createElement('ul');
        div.appendChild(ul);

        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = category.name;

        li.appendChild(span);
        li.appendChild(createUlFromItems(category.items));
        ul.appendChild(li);

    });

    function setActiveItem(item, index) {
        const itemToActivate = `${item} ${index}`;

        categories.forEach(category => {
            category.items.forEach((currentItem, itemIndex) => {
                if (currentItem === 'Persuasive') {
                    category.items[itemIndex] = itemToActivate;
                    const liToUpdate = document.querySelector(`#${category.id} > ul > li`);
                    liToUpdate.textContent = itemToActivate;
                }
            });
        });

    }


    return latestGoogleDiv;
}



function addElementGoogle() {
    const latestGoogle = createLatestGoogle();
    let messageInput = document.querySelector("main > div.absolute.bottom-0.left-0.w-full.border-t > form > div > div.flex.flex-col.w-full.py-2.flex-grow");
    let messageInputContainer = messageInput.parentNode;
    latestGoogle.appendChild(createFollowUpDiv());
    messageInputContainer.insertBefore(latestGoogle, messageInput);
}

setInterval(() => {
    const element = document.querySelector(".latest_google");
    if (!element) {
        addElementGoogle();
    }
}, 1000);

addElementGoogle();