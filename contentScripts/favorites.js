const svgFileUrl = chrome.runtime.getURL('assets/images/favorites.svg');

fetch(svgFileUrl)
    .then(response => response.text())
    .then(svgContent => {
        function addFavoritesButton() {
            const chatMessage = $(this);
            const parentElement = chatMessage.parent().parent().parent();
            if (parentElement.find('.button_wait').length < 1) {
                const button = $('<button>')
                    .click(() => {
                        const innerText = parentElement.children().children().children().first().text();
                        createBookmark(innerText)
                            .then(result => console.log(result))
                            .catch(error => console.error(error));
                    })
                    .html(svgContent);
                const div = $('<div>')
                    .addClass('button_wait')
                    .append(button);
                parentElement.append(div);
            }
        }

        setInterval(() => {
            $('div > div > button.p-1.rounded-md:first-child').each(function(element, index) {
                if (index % 2 !== 0) { 
                    addFavoritesButton.call(this);
                }
            });
        }, 1000);
    })
    .catch(error => {
        console.error('Error loading SVG file:', error);
    });
