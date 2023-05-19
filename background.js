chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      "id": "sendToChatGPT",
      "title": "Send to ChatGPT",
      "contexts": ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "sendToChatGPT") {
      var newURL = "https://chat.openai.com/";
      let text = info.selectionText;
      chrome.tabs.create({
        url: newURL
      }, function (tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (info.status === 'complete' && tabId === tab.id) {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
              target: {
                tabId: tab.id
              },
              func: (selectedText) => {
                setTimeout(function () {
                  document.querySelector('textarea').value = selectedText;
                  let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');
                  send_button.removeAttribute('disabled');
                  send_button.click();
                }, 1500);
              },
              args: [text]
            });
          }
        });
      });
    }
  });