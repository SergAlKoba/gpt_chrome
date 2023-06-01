let selectedTone = localStorage.getItem("tone");
let selectedStyle = localStorage.getItem("style");

console.log({ selectedTone, selectedStyle });

function applyCurrentTheme() {
    $('body').attr('class', `${selectedTone} ${selectedStyle}`);
    $('body').css("--mainbg", `url("${chrome.runtime.getURL(`assets/images/${selectedTone}.png`)}")`);
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