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

function createLatestGoogle() {
    const latestGoogle = createElem('div', { class: 'latest_google' }, [
        createElem('div', { class: 'latest_data' }, [
            createElem('span', { class: 'info' }, [
                createElem('img', { src: 'assets/images/Info.svg', alt: '' }, [])
            ]),
            createElem('p', {}, ['Include latest google data']),
            createElem('button', {
                class:
                    'bg-green-600 relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 h-6 w-11',
                id: 'headlessui-switch-:rh:',
                role: 'switch',
                type: 'button',
                tabindex: '0',
                'aria-checked': 'true',
                'data-headlessui-state': 'checked'
            }, [
                createElem('span', { class: 'sr-only' }, ['Use setting']),
                createElem('span', {
                    class:
                        'pointer-events-none relative inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5 h-5 w-5'
                }, [
                    createElem('span', {
                        class: 'opacity-0 duration-100 ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                        'aria-hidden': 'true'
                    }, []),
                    createElem('span', {
                        class: 'opacity-100 duration-200 ease-in absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                        'aria-hidden': 'true'
                    }, [])
                ])
            ])
        ]),
        createElem('div', { class: 'tone' }, [
            createElem('p', {}, ['Tone :']),
            createElem('ul', {}, [
                createElem('li', {}, [
                    'Persuasive',
                    createElem('ul', {}, [
                        createElem('li', {}, ['Persuasive 1']),
                        createElem('li', {}, ['Persuasive 2']),
                        createElem('li', {}, ['Persuasive 3']),
                        createElem('li', {}, ['Persuasive 4']),
                        createElem('li', {}, ['Persuasive 5']),
                        createElem('li', {}, ['Persuasive 6'])
                    ])
                ])
            ])
        ]),
        createElem('div', { class: 'style' }, [
            createElem('p', {}, ['Style :']),
            createElem('ul', {}, [
                createElem('li', {}, [
                    'Descriptive',
                    createElem('ul', {}, [
                        createElem('li', {}, ['Descriptive 1']),
                        createElem('li', {}, ['Descriptive 2']),
                        createElem('li', {}, ['Descriptive 3']),
                        createElem('li', {}, ['Descriptive 4']),
                        createElem('li', {}, ['Descriptive 5']),
                        createElem('li', {}, ['Descriptive 6'])
                    ])
                ])
            ])
        ]),
    ]);
    return latestGoogle;
}



function addElementGoogle() {
    const latestGoogle = createLatestGoogle();
    let messageInput = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex > div.flex.h-full.max-w-full.flex-1.flex-col > main > div.absolute.bottom-0.left-0.w-full.border-t > form > div > div.flex.flex-col.w-full.py-2.flex-grow");
    let messageInputContainer = messageInput.parentNode;
    messageInputContainer.insertBefore(latestGoogle, messageInput);
}

setInterval(() => {
    const element = document.querySelector(".latest_google");
    if (!element) {
        addElementGoogle();
    }
}, 1000);

addElementGoogle();