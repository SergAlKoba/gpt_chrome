const pricingPlan = [
  {
    name: "Free",
    mostPopular: false,
    price: "0",
    btnText: "free",
    featuresText: "Free features...",
    features: [
      'Access "Playground" Prompts',
      "Basic Tone/Style Modifiers",
      "Standard Theme",
      "Dummy feature",
      "Dummy feature",
    ],
  },
  {
    name: "Tier 1",
    mostPopular: true,
    price: "7.20",
    btnText: "Upgrade to tier 1",
    featuresText: "Everything in Free, plus…",
    features: [
      "Full Prompt Library Access",
      "Alchemy Dashboard Access",
      "Up to 5 Bookmarks",
      "Upto 5 Custom Prompts",
      "All Style/Tone Modifiers",
    ],
  },
  {
    name: "Tier 2",
    mostPopular: false,
    price: "19",
    btnText: "Upgrade to tier 2",
    featuresText: "Everything in Tier 1, plus…",
    features: [
      "25% of style/tone modifiers",
      "Light/Dark Theme",
      "Free X prompts a day",
      "Dummy feature",
      "Dummy feature",
    ],
  },
  {
    name: "Tier 3",
    mostPopular: false,
    price: "39.20",
    btnText: "Upgrade to tier 3",
    featuresText: "Everything in Tier 2, plus…",
    features: [
      "Early Access to new features",
      "Light/Dark Theme",
      "Free X prompts a day",
      "Dummy feature",
      "Dummy feature",
    ],
  },
];

function createSubscriptionPopup() {
  const popup = document.createElement("div");
  popup.classList.add("popup", "active");

  const closeSpan = document.createElement("span");
  closeSpan.classList.add("close");
  popup.appendChild(closeSpan);

  closeSpan.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup_content", "subscription_popup");
  popup.appendChild(popupContent);

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  popupContent.appendChild(titleDiv);

  const titleHeading = document.createElement("h5");
  titleHeading.textContent = "Choose your plan";
  titleDiv.appendChild(titleHeading);

  const wrapperBtnsPlan = document.createElement("div");
  wrapperBtnsPlan.classList.add("wrapper_btns_plan");
  popupContent.appendChild(wrapperBtnsPlan);

  const btnsPlan = document.createElement("div");
  btnsPlan.classList.add("btns_plan");

  const btns = [{ text: "Annually (-%20)" }, { text: "Monthly" }];
  btns.forEach(({ text }) => {
    const btn = document.createElement("div");

    btn.onclick = function () {
      const isActive = btnsPlan.querySelector(".btn.active");
      if (isActive) {
        btnsPlan.querySelector(".btn.active").classList.remove("active");
      }
      btn.classList.toggle("active");
    };

    btn.textContent = text;
    btn.classList.add("btn");
    btnsPlan.appendChild(btn);
  });

  wrapperBtnsPlan.appendChild(btnsPlan);

  const wrapperPricingPlan = document.createElement("div");
  wrapperPricingPlan.classList.add("pricing_plan");
  popupContent.appendChild(wrapperPricingPlan);

  pricingPlan.forEach((card) => wrapperPricingPlan.appendChild(createCardPricingPlan(card, wrapperPricingPlan)));

  return popup;
}

function createCardPricingPlan({ name, mostPopular, price, btnText, featuresText, features }, wrapperPricingPlan) {
  const card = document.createElement("div");
  card.classList.add("card_pricing_plan");

  const giftImg = document.createElement("img");
  giftImg.src = chrome.runtime.getURL("assets/images/gift.svg");

  const mostPopularBtn = document.createElement("img");
  mostPopularBtn.classList.add("most_popupal_btn");
  mostPopularBtn.src = chrome.runtime.getURL("assets/images/most_popular.svg");

  const divMostPopular = document.createElement("div");
  divMostPopular.classList.add("divMostPopular");
  divMostPopular.appendChild(mostPopularBtn);
  const borderPopular = document.createElement("div");
  borderPopular.classList.add("border_popular");

  divMostPopular.appendChild(borderPopular);

  const wrapperImgAndMostPopular = document.createElement("div");
  wrapperImgAndMostPopular.appendChild(giftImg);

  if (mostPopular) wrapperImgAndMostPopular.appendChild(divMostPopular);
  wrapperImgAndMostPopular.classList.add("wrapper_img_an_most_popular");

  const plan = document.createElement("div");
  plan.textContent = name;
  plan.classList.add("plan");

  const wrapperPrice = document.createElement("div");
  wrapperPrice.classList.add("wrapper_price");

  wrapperPrice.innerHTML = `<span class='price'>${price}</span> <span class='text_price'>/per month </span>`;

  const btnPlan = document.createElement("button");
  btnPlan.classList.add("btn_plan");

  btnPlan.onclick = function () {
    const isActive = wrapperPricingPlan.querySelector(".btn_plan.active");
    console.log('card.querySelector(".btn_plan.active")', wrapperPricingPlan.querySelector(".btn_plan.active"));
    if (isActive) {
      const activeElement = wrapperPricingPlan.querySelector(".btn_plan.active");
      activeElement.classList.remove("active");
    }
    btnPlan.classList.toggle("active");
  };

  btnPlan.textContent = btnText;

  const featureTextSpan = document.createElement("span");
  featureTextSpan.classList.add("feature_text");
  featureTextSpan.textContent = featuresText;

  const wrapperFeatures = document.createElement("div");

  features.forEach((text) => {
    const wrapperFeature = document.createElement("div");
    wrapperFeature.classList.add("wrapper_feature");

    const checkedIcon = document.createElement("img");
    checkedIcon.src = chrome.runtime.getURL("assets/images/feature_check.svg");

    const featureText = document.createElement("span");
    featureText.classList.add("feature_text_item");
    featureText.textContent = text;

    wrapperFeature.append(checkedIcon, featureText);
    wrapperFeatures.appendChild(wrapperFeature);
  });

  card.append(wrapperImgAndMostPopular, plan, wrapperPrice, btnPlan, featureTextSpan, wrapperFeatures);
  return card;
}
