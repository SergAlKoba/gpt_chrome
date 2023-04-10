document.getElementById('apply-theme').addEventListener('click', function () {
  const selectedTheme = document.getElementById('theme-selector').value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { theme: selectedTheme });
  });
});
