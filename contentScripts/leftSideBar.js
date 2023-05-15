function createATag() {
    const aTag = $('<a/>', {
        class: 'theme_settings flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm',
        html: '<svg style="width: 16px;" width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 0.25H3.75C2.75544 0.25 1.80161 0.645088 1.09835 1.34835C0.395088 2.05161 0 3.00544 0 4V10.75C0 11.3467 0.237053 11.919 0.65901 12.341C1.08097 12.7629 1.65326 13 2.25 13H6.75L6.01031 17.3753C6.00358 17.4165 6.00013 17.4582 6 17.5C6 18.2956 6.31607 19.0587 6.87868 19.6213C7.44129 20.1839 8.20435 20.5 9 20.5C9.79565 20.5 10.5587 20.1839 11.1213 19.6213C11.6839 19.0587 12 18.2956 12 17.5C11.9999 17.4582 11.9964 17.4165 11.9897 17.3753L11.25 13H15.75C16.3467 13 16.919 12.7629 17.341 12.341C17.7629 11.919 18 11.3467 18 10.75V1C18 0.801088 17.921 0.610322 17.7803 0.46967C17.6397 0.329018 17.4489 0.25 17.25 0.25ZM3.75 1.75H13.5V5.5C13.5 5.69891 13.579 5.88968 13.7197 6.03033C13.8603 6.17098 14.0511 6.25 14.25 6.25C14.4489 6.25 14.6397 6.17098 14.7803 6.03033C14.921 5.88968 15 5.69891 15 5.5V1.75H16.5V7.75H1.5V4C1.5 3.40326 1.73705 2.83097 2.15901 2.40901C2.58097 1.98705 3.15326 1.75 3.75 1.75ZM15.75 11.5H11.25C11.0351 11.5 10.8227 11.5462 10.6272 11.6354C10.4317 11.7246 10.2577 11.8548 10.1169 12.0171C9.97607 12.1794 9.87177 12.3701 9.81107 12.5762C9.75036 12.7824 9.73465 12.9991 9.765 13.2119V13.2306L10.5 17.5563C10.5 17.9541 10.342 18.3356 10.0607 18.6169C9.77936 18.8982 9.39782 19.0563 9 19.0563C8.60218 19.0563 8.22064 18.8982 7.93934 18.6169C7.65804 18.3356 7.5 17.9541 7.5 17.5563L8.23125 13.2306V13.2119C8.26156 12.9995 8.24594 12.783 8.18545 12.5771C8.12496 12.3713 8.021 12.1808 7.8806 12.0185C7.7402 11.8562 7.56662 11.726 7.37158 11.6365C7.17654 11.5471 6.96457 11.5005 6.75 11.5H2.25C2.05109 11.5 1.86032 11.421 1.71967 11.2803C1.57902 11.1397 1.5 10.9489 1.5 10.75V9.25H16.5V10.75C16.5 10.9489 16.421 11.1397 16.2803 11.2803C16.1397 11.421 15.9489 11.5 15.75 11.5Z" fill="white"/></svg>'
    });

    const textNode = document.createTextNode("Theme Settings");
    aTag.addClass('theme-settings-toggle');
    aTag.append(textNode);
    aTag.on('click', (e) => {
        e.preventDefault();
        selectedStyleTmp = selectedStyle;
        selectedToneTmp = selectedTone;
        $("#global .theme_settings_content").addClass("active");
    });
    
    const imgTag = $('<img/>', {
        src: chrome.runtime.getURL("assets/images/theme_settings_img1.png"),
        alt: ""
    });
    aTag.append(imgTag);
    
    return aTag;
    
}

function addElement() {
    const aTag = createATag();
    $("#__next .overflow-hidden.w-full.h-full .dark .flex.h-full nav .border-t").parent().append(aTag);
}

function checkElement() {
    const element = $(".theme-settings-toggle");
    if (!element.length) {
        addElement();
    }
}

setInterval(function () {
    $("a.bg-gray-900").removeClass("bg-gray-900");
    checkElement();
}, 1000);

addElement();
