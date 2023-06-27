let selectedTone = localStorage.getItem("tone");
let selectedStyle = localStorage.getItem("style");

console.log({ selectedTone, selectedStyle });

function applyCurrentTheme() {
    let body = $('body');
    body.attr('class', `${selectedTone} ${selectedStyle}`);
    body.css("--mainbg", `url("${chrome.runtime.getURL(`assets/images/${selectedTone}.png`)}")`);
}
applyCurrentTheme();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.theme) {
        selectedTone = request.theme;
        applyCurrentTheme();
    }
});

$('body').attr('id', 'global');

$('body').css("--dropdown-icon", `url("${chrome.runtime.getURL(`assets/images/CaretDown2.svg`)}")`);
$('body').css("--dropdown-icon-hover", `url("${chrome.runtime.getURL(`assets/images/CaretDown2_hover.svg`)}")`);
 function createChatMessageButtons(container) {

    const button1 = createButton('p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible', 'currentColor', '2', '0 0 24 24', 'round', 'round', 'h-4 w-4', 'assets/images/copy.svg');
    button1.classList.add('btn_1');
    
    button1.onclick = (e) => {
      e.preventDefault();
      
      const copyText = container.parentNode.querySelector('.break-words').innerText;
      console.log(copyText);
      navigator.clipboard.writeText(copyText);
    };
    

    // const button2 = createButton('p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible', '', '', '', '', '', '', 'assets/images/thumbs-up2.svg');
    // const button3 = createButton('p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible', '', '', '', '', '', '', 'assets/images/thumbs-down2.svg');
    

    const button4 = createButton('p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible', '', '', '', '', '', '', 'assets/images/bookmark.svg');
    button4.classList.add('saveBtn');
    button4.classList.add('btn_1');
    button4.onclick = async (e) => {
        e.preventDefault();

    const getMessageChatGpt=()=> $(container).parent().parent().find('.break-words');
    const isExistMessageChatGpt = () => getMessageChatGpt().length > 0;


    if (isExistMessageChatGpt()) {
        const textChatGpt = getMessageChatGpt().text();
        await createBookmark(textChatGpt)
    }       
    };

    // container.appendChild(button1);
    // container.appendChild(button2);
    // container.appendChild(button3);
    container.appendChild(button4);
    // }

}


function checkAndUpdateChatMessageButtons() {
    const selector = "#global .relative.transition-width .w-full .text-gray-400.flex.self-end.justify-center.mt-2.gap-2.visible";
    const elements = Array.from(document.querySelectorAll(selector));
    let k = 0;
    elements.forEach(element => {
        ++k;
        if (!element.querySelector('.btn_1') && k % 2 === 0) {
            createChatMessageButtons(element);
        }
    });
}

setInterval(checkAndUpdateChatMessageButtons, 1000);


function createButton(className, stroke, strokeWidth, viewBox, strokeLinecap, strokeLinejoin, svgClass, imgSrc) {
    const button = document.createElement('button');
    button.className = className;

    if (imgSrc) {
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL(imgSrc);
        img.alt = '';
        button.appendChild(img);
    } else {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('stroke', stroke);
        svg.setAttribute('stroke-width', strokeWidth);
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('stroke-linecap', strokeLinecap);
        svg.setAttribute('stroke-linejoin', strokeLinejoin);
        svg.className = svgClass;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(path);
        button.appendChild(svg);
    }

    return button;
}

// document.querySelector('').appendChild(container);

createSpinner = () => {
    const spinner = document.createElement('div')
    spinner.className = "loading-spinner";
    spinner.style.display = "none";
    const spinnerChild = document.createElement('div');
    spinnerChild.className = "spinner";
    spinner.appendChild(spinnerChild);
    $('body').append(spinner);
    return spinner;
}
console.log('createSpinner',createSpinner());
