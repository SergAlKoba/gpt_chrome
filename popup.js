document.getElementById('apply-theme').addEventListener('click', function () {
  const selectedTheme = document.getElementById('theme-selector').value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { theme: selectedTheme });
  });
});

const menuBtn = document.querySelector('.menu');
const element = document.querySelector('.stretch.mx-2.flex.flex-row.gap-3');
menuBtn.addEventListener('click', function() {
  
  element.classList.add('active');
});



