const prompsterComands = [{
    text: 'Make this more consistent',
    command: 'Make this more consistent',
    promptCommand: '/ask'
}, {
    text: 'Tell me more about this',
    command: 'Tell me more about this',
    promptCommand: '/tell'
}, {text: 'Expand details', command: 'Expand details', promptCommand: '/expand'}, {
    text: 'Give me better suggestions',
    command: 'Give me better suggestions',
    promptCommand: '/suggest'
}, {text: 'Wrap this up', command: 'Wrap this up', promptCommand: '/wrap'},];

function createElementModal(tag, attributes, children) {
    const elem = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
        elem.setAttribute(key, attributes[key]);
    });
    children.forEach(child => {
        elem.appendChild(child);
    });
    return elem;
}

function sendModalInput(selected_prompt) {
    let send_button = document.querySelector('form > div > div > button');
    let textarea = document.querySelector("textarea");
    textarea.value = selected_prompt;

    // Create and dispatch the input event
    let event = new Event('input', {
        'bubbles': true, 'cancelable': true
    });
    textarea.dispatchEvent(event);
    send_button.removeAttribute('disabled');
    send_button.click();
}

function createUlFromItems(items) {
    const liItems = [];
    items.forEach(item => {
        const spanNode = createElementModal('span', {style: 'color: #ACFFA6;'}, [document.createTextNode(item.promptCommand)]);
        const textNode = document.createTextNode(' ' + item.text);
        const li = createElementModal('li', {
            class: 'prompster-item visible',
            value: item.promptCommand,
            'data-command': item.text
        }, [spanNode, textNode]);

        li.onclick = () => {
            sendModalInput(li.getAttribute('data-command'));
            prompster.classList.remove('active');
            ul.classList.remove('active');
        };

        liItems.push(li);
    });

    return createElementModal('ul', {id: 'prompsterList', style: 'overflow-y: auto; max-height: 200px;'}, liItems);
}


function filterPrompsterItems(searchText) {
    const normalizeText = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    Array.from(document.querySelectorAll(".prompster-item")).forEach(item => {
        const itemCommand = item.getAttribute('value');
        const itemText = normalizeText(itemCommand);

        const searchRegExp = new RegExp(normalizeText(searchText), 'g');
        if (!itemText.match(searchRegExp)) {
            item.style.display = "none";
            item.classList.remove("visible");
        } else {
            item.style.display = "list-item";
            item.classList.add("visible");
        }
    });
}

function createPrompster() {
    const ul = createUlFromItems(prompsterComands);
    const prompster = createElementModal('div', {id: 'prompster', class: 'prompster'}, [ul]);

    return prompster;
}


function addPrompster() {
    const container = document.querySelector('textarea').parentElement;
    container.appendChild(createPrompster());
    const textArea = document.querySelector('textarea');
    const selectorPromster = document.querySelector("#prompster");
    const selectorUlPromster = selectorPromster.querySelector("ul");

    textArea.addEventListener('keydown', function (e) {
        if (e.key === '/' && textArea.value.length == 0) {
            e.preventDefault();
            selectorPromster.classList.toggle('active');
            selectorUlPromster.classList.toggle('active');

            if (selectorPromster.classList.contains('active')) {
                textArea.value = '';
                filterPrompsterItems('');
            }
        }
    });


    textArea.addEventListener('input', (e) => {
        if (selectorPromster.classList.contains('active')) {
            filterPrompsterItems(e.target.value);
        }
    });

    textArea.addEventListener('keydown', (e) => {
        if (e.key == 'Enter' && selectorPromster.classList.contains('active')) {
            e.preventDefault();
            const visibleItems = document.querySelectorAll('.prompster-item.visible');
            if (visibleItems.length > 0) {
                visibleItems[0].click();
                selectorPromster.classList.remove('active');
                selectorUlPromster.classList.remove('active');
            }
        }
    });


    textArea.addEventListener('blur', () => {
        setTimeout(() => {
            selectorPromster.classList.remove('active');
            selectorUlPromster.classList.remove('active');
        }, 100);
    });
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            const idPrompster = document.getElementById('prompster');
            if (idPrompster == null || idPrompster == undefined) {
                addPrompster();
            }
        }
    }
});

observer.observe(document.body, {childList: true, subtree: true});
