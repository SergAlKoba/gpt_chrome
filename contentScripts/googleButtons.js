document.querySelector(':root').style.setProperty("--followUpCaretDown", `url(${chrome.runtime.getURL("assets/images/follow_up_CaretDown.svg")})`);
document.querySelector(':root').style.setProperty("--toneCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);
document.querySelector(':root').style.setProperty("--styleCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);

const googleStyles = [{
        title: 'Narrative',
        name: 'name 1'
    },
    {
        title: 'Expository',
        name: 'name 2'
    },
    {
        title: 'Descriptive',
        name: 'name 3'
    },
    {
        title: 'Persuasive',
        name: 'name 4'
    },
    {
        title: 'Creative',
        name: 'name 5'
    },
    {
        title: 'Technical',
        name: 'name 6'
    },
    {
        title: 'Review',
        name: 'name 7'
    },
    {
        title: 'Poetic',
        name: 'name 8'
    },
    {
        title: 'Academic',
        name: 'name 9'
    },
    {
        title: 'Business',
        name: 'name 10'
    }
];

const googleTones = [{
        title: 'Formal',
        name: 'name 1'
    },
    {
        title: 'Informal',
        name: 'name 2'
    },
    {
        title: 'Optimistic',
        name: 'name 3'
    },
    {
        title: 'Pessimistic',
        name: 'name 4'
    },
    {
        title: 'Joyful',
        name: 'name 5'
    },
    {
        title: 'Sad',
        name: 'name 6'
    },
    {
        title: 'Sincere',
        name: 'name 7'
    },
    {
        title: 'Hypocritical',
        name: 'name 8'
    },
    {
        title: 'Fearful',
        name: 'name 9'
    },
    {
        title: 'Hopeful',
        name: 'name 10'
    },
    {
        title: 'Humorous',
        name: 'name 11'
    },
    {
        title: 'Serious',
        name: 'name 12'
    }
];


const categories = [{
        id: 'tone-google',
        name: 'Persuasive',
        items: googleTones,
        className: 'Tone'
    },
    {
        id: 'style-google',
        name: 'Descriptive',
        items: googleStyles,
        className: 'Style'
    },
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

    const pointerEventsSpan = document.createElement('span');
    pointerEventsSpan.className = 'pointer-events-none relative inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5 h-5 w-5';
    latestDataDiv.appendChild(pointerEventsSpan);

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

function addMicrophone() {
    const microphoneDiv = document.createElement('div');
    microphoneDiv.className = 'microphone';
    const svg = document.createElement('svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const path = document.createElement('path');
    path.setAttribute('d', 'M7.5 12V6C7.5 4.80653 7.97411 3.66193 8.81802 2.81802C9.66193 1.97411 10.8065 1.5 12 1.5C13.1935 1.5 14.3381 1.97411 15.182 2.81802C16.0259 3.66193 16.5 4.80653 16.5 6V12C16.5 13.1935 16.0259 14.3381 15.182 15.182C14.3381 16.0259 13.1935 16.5 12 16.5C10.8065 16.5 9.66193 16.0259 8.81802 15.182C7.97411 14.3381 7.5 13.1935 7.5 12ZM19.5 12C19.5 11.8011 19.421 11.6103 19.2803 11.4697C19.1397 11.329 18.9489 11.25 18.75 11.25C18.5511 11.25 18.3603 11.329 18.2197 11.4697C18.079 11.6103 18 11.8011 18 12C18 13.5913 17.3679 15.1174 16.2426 16.2426C15.1174 17.3679 13.5913 18 12 18C10.4087 18 8.88258 17.3679 7.75736 16.2426C6.63214 15.1174 6 13.5913 6 12C6 11.8011 5.92098 11.6103 5.78033 11.4697C5.63968 11.329 5.44891 11.25 5.25 11.25C5.05109 11.25 4.86032 11.329 4.71967 11.4697C4.57902 11.6103 4.5 11.8011 4.5 12C4.50228 13.8586 5.19368 15.6504 6.44048 17.0288C7.68728 18.4072 9.40091 19.2743 11.25 19.4625V21.75C11.25 21.9489 11.329 22.1397 11.4697 22.2803C11.6103 22.421 11.8011 22.5 12 22.5C12.1989 22.5 12.3897 22.421 12.5303 22.2803C12.671 22.1397 12.75 21.9489 12.75 21.75V19.4625C14.5991 19.2743 16.3127 18.4072 17.5595 17.0288C18.8063 15.6504 19.4977 13.8586 19.5 12Z');
    path.setAttribute('fill', 'white');
    svg.appendChild(path);
    microphoneDiv.appendChild(svg);
    let parent_element = document.querySelector('form > div').childNodes[2];
    parent_element.appendChild(microphoneDiv);
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
    const micro = document.querySelector(".microphone");
    if (!micro) {
        addMicrophone();
    }
}, 1000);

addElementGoogle();
addMicrophone();