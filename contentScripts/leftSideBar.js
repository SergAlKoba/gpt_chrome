function createATag() {
  const aTag = $("<a/>", {
    class:
      "theme_settings flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm",
    html: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.62117 14.9627L6.72197 15.1351C7.53458 15.2623 8.11491 16.0066 8.05506 16.8451L7.97396 17.9816C7.95034 18.3127 8.12672 18.6244 8.41885 18.7686L9.23303 19.1697C9.52516 19.3139 9.87399 19.2599 10.1126 19.0352L10.9307 18.262C11.5339 17.6917 12.4646 17.6917 13.0685 18.262L13.8866 19.0352C14.1252 19.2608 14.4733 19.3139 14.7662 19.1697L15.5819 18.7678C15.8733 18.6244 16.0489 18.3135 16.0253 17.9833L15.9441 16.8451C15.8843 16.0066 16.4646 15.2623 17.2772 15.1351L18.378 14.9627C18.6985 14.9128 18.9568 14.6671 19.0292 14.3433L19.23 13.4428C19.3025 13.119 19.1741 12.7831 18.9064 12.5962L17.9875 11.9526C17.3095 11.4774 17.1024 10.5495 17.5119 9.82051L18.067 8.83299C18.2284 8.54543 18.2017 8.18538 17.9993 7.92602L17.4363 7.2035C17.2339 6.94413 16.8969 6.83701 16.5867 6.93447L15.5221 7.26794C14.7355 7.51441 13.8969 7.1012 13.5945 6.31908L13.1866 5.26148C13.0669 4.95218 12.7748 4.7492 12.4496 4.75L11.5472 4.75242C11.222 4.75322 10.9307 4.95782 10.8126 5.26793L10.4149 6.31344C10.1157 7.1004 9.27319 7.51683 8.4842 7.26874L7.37553 6.92078C7.0645 6.82251 6.72591 6.93044 6.52355 7.19142L5.96448 7.91474C5.76212 8.17652 5.73771 8.53738 5.90228 8.82493L6.47 9.81487C6.88812 10.5446 6.68339 11.4814 6.00149 11.9591L5.0936 12.5954C4.82588 12.7831 4.69754 13.119 4.76998 13.442L4.97077 14.3425C5.04242 14.6671 5.30069 14.9128 5.62117 14.9627Z" stroke="#898F93" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.5911 10.4089C14.4696 11.2875 14.4696 12.7125 13.5911 13.5911C12.7125 14.4696 11.2875 14.4696 10.4089 13.5911C9.53036 12.7125 9.53036 11.2875 10.4089 10.4089C11.2875 9.53036 12.7125 9.53036 13.5911 10.4089Z" stroke="#898F93" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  });

  const textNode = document.createTextNode("Themes");
  aTag.addClass("theme-settings-toggle");
  aTag.append(textNode);
  aTag.on("click", (e) => {
    e.preventDefault();
    selectedStyleTmp = selectedStyle;
    selectedToneTmp = selectedTone;
    $("#global .theme_settings_content").addClass("active");
  });

  // const imgTag = $("<img/>", {
  //   src: chrome.runtime.getURL("assets/images/theme_settings_img1.png"),
  //   alt: "",
  // });
  // aTag.append(imgTag);

  return aTag;
}

function createDashboard() {
  const dashboard = $(`<a/>`, {
    class:
      "theme_settings flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm",
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z" stroke="#898F93" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9.75 8.75V19" stroke="#898F93" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 8.25H19" stroke="#898F93" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `,
  });

  dashboard.on("click", (e) => {
    e.preventDefault();
    window.open("https://gotgood.ai/dashbord", "_blank");
  });

  const span = document.createElement("span");
  span.className = "dashboard_link";
  span.textContent = "Dashboard";
  dashboard.addClass("theme-settings-toggle");
  dashboard.append(span);

  return dashboard;
}

function addElement() {
  const dashboard = createDashboard();
  const aTag = createATag();
  $("#__next .overflow-hidden.w-full.h-full .dark .flex.h-full nav .border-t").parent().append(dashboard);
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
