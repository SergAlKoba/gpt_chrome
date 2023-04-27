
// const svgFileUrl = chrome.runtime.getURL('assets/images/favorites.svg');


// fetch(svgFileUrl)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.text();
//     })
//     .then(svgContent => {
       
//         const svgContainer = document.createElement('div');
//         svgContainer.innerHTML = svgContent;

    
//         const svgElement = svgContainer.querySelector('svg');

        
//         const container = document.body;
//         container.appendChild(svgElement);
//     })
//     .catch(error => {
//         console.error('Error loading SVG file:', error);
//     });