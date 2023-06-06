document.querySelector(':root').style.setProperty("--followUpCaretDown", `url(${chrome.runtime.getURL("assets/images/follow_up_CaretDown.svg")})`);
document.querySelector(':root').style.setProperty("--toneCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);
document.querySelector(':root').style.setProperty("--styleCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);
document.querySelector(':root').style.setProperty("--languageCaretDown", `url(${chrome.runtime.getURL("assets/images/CaretDown.svg")})`);

const languages = {
    'English': 'en-US',
    'French': 'fr-FR',
    'Spanish': 'es-ES',
    'Russian': 'ru-RU',
    'Ukrainian': 'uk-UA'
};

const googleStyles = [{
    title: 'Default',
    name: 'name 1'
},
{
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
    title: 'Default',
    name: 'name 1'
},
{
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

const languagesList = [{
    title: 'Default',
    name: 'name 1'
},
{
    title: 'English',
    name: 'name 1'
},
{
    title: 'Russian',
    name: 'name 2'
},
{
    title: 'Ukrainian',
    name: 'name 3'
}
];

const categories = [{
    id: 'tone-google',
    name: 'Default',
    items: googleTones,
    className: 'Tone',
    displayName: 'Tone'
},
{
    id: 'style-google',
    name: 'Default',
    items: googleStyles,
    className: 'Style',
    displayName: 'Style'
},
{
    id: 'language-google',
    name: 'Default',
    items: languagesList,
    className: 'Language',
    displayName: 'Output language'
},
];

const followUpItems = [
    'Make this more consistent',
    'Tell me more about this',
    'Expand details',
    'Give me better suggestions',
    'Wrap this up',
];

function createUlSFromCategory(category) {
    const ul = document.createElement('ul');
    ul.style.minWidth = '100px';

    if (category.items[0].title !== 'Default') {
        localStorage.setItem('Prompt payload', !localStorage.getItem('Prompt payload') ? ` ${category.displayName}: ${category.items[0].title}` : localStorage.getItem('Prompt payload') + ` ${category.displayName}: ${category.items[0].title} `);

    } else if (localStorage.getItem('Prompt payload')) {

        localStorage.setItem('Prompt payload', localStorage.getItem('Prompt payload').replace(new RegExp(`${category.displayName}: \\w+`), ``));
        localStorage.removeItem(category.className);

    }

    category.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title;
        li.style.minWidth = '100%';
        li.onclick = function () {
            itemClickHandler(category.className, category.displayName, item, li);
        };
        ul.appendChild(li);
    });

    return ul;
}

function itemClickHandler(type, displayName, item, li) {
    console.log(type, displayName, item);

    localStorage.setItem(type, item.title);

    if (!localStorage.getItem('Prompt payload')) {
        localStorage.setItem('Prompt payload', ` ${displayName}: ${item.title} `);
    } else {
        if (localStorage.getItem('Prompt payload').includes(displayName)) {
            localStorage.setItem('Prompt payload', localStorage.getItem('Prompt payload').replace(new RegExp(`${displayName}: \\w+`), `${displayName}: ${item.title}`));
        } else {
            localStorage.setItem('Prompt payload', localStorage.getItem('Prompt payload') + ` ${displayName}: ${item.title} `);
        }


    }



    li.parentElement.parentElement.querySelector('span').textContent = item.title;
}



const createElem = (tag, attributes, children) => {
    const elem = document.createElement(tag);

    for (const key in attributes) {
        elem.setAttribute(key, attributes[key]);
    }

    children?.forEach(child => {
        if (typeof child === 'string') {
            elem.appendChild(document.createTextNode(child));
        } else {
            elem.appendChild(child);
        }
    });

    return elem;
};


function createChecklistElement() {
    var divElement = document.createElement("div");
    divElement.className = "checklist";

    var linkElement = document.createElement("a");
    linkElement.href = "javascript:void(0)";

    var imgElement = document.createElement("img");
    imgElement.src = chrome.runtime.getURL("assets/images/checklist.svg");
    imgElement.alt = "";

    linkElement.appendChild(imgElement);
    divElement.appendChild(linkElement);

    return divElement;
}

function createFollowUpDiv() {
    const createListItem = (text) => {
        const li = document.createElement('li');
        li.textContent = text;
        li.onclick = () => {
            const userInput = document.querySelector('textarea');
            userInput.value = text;
            console.log(text);
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
    div.classList.add('style');
    div.id = 'follow_up';
    div.appendChild(createFollowUpList());
    return div;
}


function createLatestGoogle() {

    const latestGoogleContentDiv = document.createElement('div');
    latestGoogleContentDiv.className = 'latest_google_content';

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
        div.classList.add('style');
        div.id = category.id;
        latestGoogleDiv.appendChild(div);

        const p = document.createElement('p');
        // p.textContent = `${category.className} :`;
        div.appendChild(p);

        const ul = document.createElement('ul');
        div.appendChild(ul);

        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = localStorage.getItem(category.className) || category.name;

        if (!localStorage.getItem(category.className)) {
            localStorage.setItem(category.className, category.name)
        }

        li.appendChild(span);
        li.appendChild(createUlSFromCategory(category, category.items));
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

    while (latestGoogleDiv.firstChild) {
        latestGoogleContentDiv.appendChild(latestGoogleDiv.firstChild);
    }

    latestGoogleDiv.appendChild(latestGoogleContentDiv);


    return latestGoogleDiv;
}

function callMicro() {
    const microphoneDiv = document.getElementById('microphone');
    microphoneDiv.click();
}

function addMicrophone() {
    const microphoneDiv = document.createElement('div');
    microphoneDiv.className = 'microphone';
    microphoneDiv.id = 'microphone';
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL(`assets/images/microphone.svg`);
    microphoneDiv.appendChild(img);
    const textArea = document.querySelector('textarea');
    const sendButton = document.querySelector('#global .stretch.mx-2.flex.flex-row.gap-3 .flex-grow.relative button');

    $(microphoneDiv).insertAfter(sendButton);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    microphoneDiv.addEventListener('click', () => {
        navigator && navigator.mediaDevices.getUserMedia({
            audio: true
        })
            .then(() => {
                if (microphoneDiv.classList.contains('microphone-is-listening')) {
                    microphoneDiv.classList.remove('microphone-is-listening');
                    recognition && recognition.stop();
                } else {
                    microphoneDiv.classList.add('microphone-is-listening');

                    if (SpeechRecognition !== undefined && textArea) {
                        recognition = new SpeechRecognition();
                        if (localStorage.getItem('Language') && localStorage.getItem('Language') !== 'Default') {
                            let language = localStorage.getItem('Language');
                            recognition.lang = languages[language];
                        }
                        recognition.start();
                        recognition.onresult = (result) => {
                            textArea.value += ` ${result.results[0][0].transcript}`;
                            sendButton.removeAttribute('disabled');
                            microphoneDiv.classList.remove('microphone-is-listening');
                        };
                    }
                }
            })
            .catch(() => {
                alert('Microphone access denied');
            });
    });
}



function addElementGoogle() {
    const latestGoogle = createLatestGoogle();
    var checklistElement = createChecklistElement();

    let messageInput = document.querySelector("main > div.absolute.bottom-0.left-0.w-full.border-t > form");

    let latestGoogleContent = latestGoogle.querySelector('.latest_google_content');
    latestGoogleContent.appendChild(createFollowUpDiv());

    $(latestGoogle).insertAfter(messageInput);
    latestGoogle.prepend(checklistElement);
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

function handleKeyDown(e) {
    if (e.code === 'KeyB' && (e.metaKey || e.ctrlKey)) {
        callMicro();
    }
}

document.addEventListener("keydown", handleKeyDown);