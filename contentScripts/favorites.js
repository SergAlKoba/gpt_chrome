const svgFileUrl = chrome.runtime.getURL('assets/images/favorites.svg');



fetch(svgFileUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(svgContent => {
        function addFavoritesButton(chatMessage) {

            const parentElement = chatMessage.parentElement.parentElement.parentElement;
            if (parentElement.querySelectorAll('.button_wait').length < 1) {
                const button = document.createElement('button');
                button.addEventListener('click', () => {
                    createBookmark(parentElement.querySelector("p").parentElement.textContent).then((result) => {
                        console.log(result);
                    });
                    console.log(parentElement.querySelector("p").parentElement.textContent);
                });
                button.innerHTML = svgContent;

                const div = document.createElement('div');
                div.className = 'button_wait';
                div.appendChild(button);

                parentElement.appendChild(div);

            }


        }

        setInterval(function () {
            const chatMessages = document.querySelectorAll('div > div > button.p-1.rounded-md:first-child');
            chatMessages.forEach(addFavoritesButton);



        }, 1000)
    })
    .catch(error => {
        console.error('Error loading SVG file:', error);
    });
