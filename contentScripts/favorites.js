const svgFileUrl = chrome.runtime.getURL('assets/images/favorites.svg');

fetch(svgFileUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(svgContent => {
        const button = document.createElement('button');
        button.textContent = 'button_wait';
        button.addEventListener('click', () => {
            
        });
        button.innerHTML = svgContent;
        
        const div = document.createElement('div');
        div.className = 'my-div';
        div.style.border = '1px solid black';
        div.appendChild(button);
        
        const container = document.body;
        container.querySelector("").appendChild(div);
    })
    .catch(error => {
        console.error('Error loading SVG file:', error);
    });
