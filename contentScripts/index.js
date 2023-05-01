let selectedTone = localStorage.getItem("tone");
let selectedStyle = localStorage.getItem("style");

let selectedToneTmp = selectedTone;
let selectedStyleTmp = selectedStyle; 

console.log({ selectedTone, selectedStyle });

function applyCurrentTheme() {
    document.body.setAttribute('class', `${selectedTone} ${selectedStyle}`);
    document.body.style.setProperty("--mainbg", `url("${chrome.runtime.getURL(`assets/images/${selectedTone}.png`)}")`);

}
applyCurrentTheme();



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.theme) {
        selectedTone = request.theme;
        applyCurrentTheme();
    }
});

document.body.setAttribute('id', 'global');

document.querySelector(':root').style.setProperty("--followUp", `url(${chrome.runtime.getURL("assets/images/follow_up_CaretDown.svg")})`);