let isGetCommandRequest = false;
let concatPromsterBEAndBasePrompster = [];

const prompsterComands = [{
    prompt: 'Make this more consistent',
    command: '/ask',
    related_prompt:null
}, {
    prompt: 'Tell me more about this',
    command: '/tell',
    related_prompt:null
}, {prompt: 'Expand details',  command: '/expand', related_prompt:null }, {
    prompt: 'Give me better suggestions',
    command: '/suggest',
    related_prompt:null
}, {prompt: 'Wrap this up', command: '/wrap',
    related_prompt:null
},];

function createElementModal(tag, attributes, children) {
    const elem = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
        elem.setAttribute(key, attributes[key]);
    });
    children.forEach(child => {
        elem.appendChild(child);
    });
    return elem;
}

function sendModalInput(selected_prompt) {
    let send_button = document.querySelector('form > div > div > button');
    let textarea = document.querySelector("textarea");
    textarea.value = selected_prompt;

    // Create and dispatch the input event
    let event = new Event('input', {
        'bubbles': true, 'cancelable': true
    });
    textarea.dispatchEvent(event);
    send_button.removeAttribute('disabled');
    send_button.click();
}

function createUlFromItems(items) {
    const liItems = [];
    items.forEach(item => {
        const spanNode = createElementModal('span', {style: 'color: #ACFFA6;'}, [document.createTextNode(item.command)]);
        const textNode = document.createTextNode(' ' + item.prompt);
        const li = createElementModal('li', {
            class: 'prompster-item visible',
            value: item.command,
            'data-command': item.prompt
        }, [spanNode, textNode]);

        function onShowPromptPopupById  (prompt)  {            
            document.body.appendChild(createPromptDetailsPopup(prompt));
          };


        li.onclick = (e) => {            
            if (item?.related_prompt===null) {
                sendModalInput(li.getAttribute('data-command'));
            }
            else {              
                e.preventDefault();
                e.stopPropagation();                
                onShowPromptPopupById(item.related_prompt)
            }
                
            prompster.classList.remove('active');
            ul.classList.remove('active');
        };

        li.addEventListener('touchstart', event => {
            console.log('touchstart');            

            // Обработчик события touchstart
            // ...
          });

        // li.touchend = (e) => {
        //     if (item?.related_prompt===null) {
        //         sendModalInput(li.getAttribute('data-command'));
        //     }
        //     else {              
        //         e.preventDefault();
        //         e.stopPropagation();                
        //         onShowPromptPopupById(item.related_prompt)
        //     }
                
        //     prompster.classList.remove('active');
        //     ul.classList.remove('active');
        // };

        liItems.push(li);
    });

    return createElementModal('ul', {id: 'prompsterList', style: 'overflow-y: auto; max-height: 200px;'}, liItems);
}


function filterPrompsterItems(searchText) {
    const normalizeText = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    Array.from(document.querySelectorAll(".prompster-item")).forEach(item => {
        const itemCommand = item.getAttribute('value');
        const itemText = normalizeText(itemCommand);

        const searchRegExp = new RegExp(normalizeText(searchText), 'g');
        if (!itemText.match(searchRegExp)) {
            item.style.display = "none";
            item.classList.remove("visible");
        } else {
            item.style.display = "list-item";
            item.classList.add("visible");
        }
    });
}

async function getPrompsterCommands() {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai/api/shop/get-commands/", requestOptions)
        .catch(error => console.log('error', error));

    let result = await response?.json();

    return result.results;
}



 function createPrompster() {

const ul = createUlFromItems(concatPromsterBEAndBasePrompster);
const prompster = createElementModal('div', {id: 'prompster', class: 'prompster'}, [ul]);

return prompster;
}

 function addPrompster() {
    const container = document.querySelector('textarea').parentElement;
    const prompster = createPrompster();
    container.appendChild(prompster);
    const textArea = document.querySelector('textarea');
    const selectorPromster = document.querySelector("#prompster");
    const selectorUlPromster = selectorPromster.querySelector("ul");

    textArea.addEventListener('keydown', function (e) {
        if (e.key === '/' && textArea.value.length == 0) {
            e.preventDefault();
            selectorPromster.classList.toggle('active');
            selectorUlPromster.classList.toggle('active');

            if (selectorPromster.classList.contains('active')) {
                textArea.value = '';
                filterPrompsterItems('');
            }
        }
    });


    textArea.addEventListener('input', (e) => {
        if (selectorPromster.classList.contains('active')) {
            filterPrompsterItems(e.target.value);
        }
    });

    textArea.addEventListener('keydown', (e) => {
        if (e.key == 'Enter' && selectorPromster.classList.contains('active')) {
            e.preventDefault();
            const visibleItems = document.querySelectorAll('.prompster-item.visible');
            if (visibleItems.length > 0) {
                visibleItems[0].click();
                selectorPromster.classList.remove('active');
                selectorUlPromster.classList.remove('active');
            }
        }
    });

    
    textArea.addEventListener("keydown", (e) => {
    if (e.code === 'Enter') {

        let isCommandMessageByShowModal = concatPromsterBEAndBasePrompster.some(({command}) => command.includes(e?.target?.value.trim()))

    if(isCommandMessageByShowModal){
        e.preventDefault();
        e.stopPropagation();  
        const textArea = document.querySelector('textarea');
        textArea.value = '';              
    }
        addSelectedCategoriesValueInEndTextareaValue();
    }
});


    textArea.addEventListener('blur', () => {
        setTimeout(() => {
            selectorPromster.classList.remove('active');
            selectorUlPromster.classList.remove('active');
        }, 100);
    });
}


// observer обернуть функцией селать запрос после успешного запроса уже писать код   observer
// 1. сделать запрос на бекенд
// 2. получить ответ

async function init  (){

   const result = await  getPrompsterCommands()
   concatPromsterBEAndBasePrompster = [...prompsterComands,...result] ;

    const observer = new MutationObserver((mutations) => {
        
        for (const mutation of mutations) {        
            if (mutation.type === 'childList') {
                const idPrompster = document.getElementById('prompster');
                if (idPrompster == null || idPrompster == undefined) {                
                    addPrompster();
                }
            }
        }
    });
    
    observer.observe(document.body, {childList: true, subtree: true});
    
}

init();

function createPromptDetailsPopup({ name, description, amount_of_lookups, like_amount, inputs, prompt_template }) {
    
    const modalState = deepClone(inputs); // [{variable_name: "variable2", placeholder: "variable2", value: "some value"}] as example
  
    const popup = document.createElement('div');
    popup.classList.add('popup', 'prompt_details_popup', 'active');
  
    const closeSpan = document.createElement('span');
    closeSpan.classList.add('close');
    popup.appendChild(closeSpan);
  
    closeSpan.addEventListener('click', () => {
    popup.classList.remove('active');
    });
  
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup_content');
    popup.appendChild(popupContent);
  
    const closePopupSpan = document.createElement('span');
    closePopupSpan.classList.add('close_popup');
    popupContent.appendChild(closePopupSpan);
  
    const closeImg = document.createElement('img');
    closeImg.src = chrome.runtime.getURL('assets/images/close.svg');
    closeImg.alt = '';
  
    closeImg.addEventListener('click', () => {
      document.body.removeChild(popup);
    });
  
    closePopupSpan.appendChild(closeImg);
  
  
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    popupContent.appendChild(titleDiv);
  
    const titleHeading = document.createElement('h5');
    titleHeading.textContent = 'Prompt details';
    titleDiv.appendChild(titleHeading);
  
    const promptPopupContentDiv = document.createElement('div');
    promptPopupContentDiv.classList.add('prompt_popup_content');
    popupContent.appendChild(promptPopupContentDiv);
  
    const tabPromptContentDiv = document.createElement('div');
    tabPromptContentDiv.classList.add('tab_prompt_content');
    promptPopupContentDiv.appendChild(tabPromptContentDiv);
  
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer');
    tabPromptContentDiv.appendChild(answerDiv);
  
    const answerHeading = document.createElement('h3');
    answerHeading.textContent = name;
    answerDiv.appendChild(answerHeading);
  
    const answerPara1 = document.createElement('p');
    answerPara1.textContent = description;
    answerDiv.appendChild(answerPara1);
  
    const statsList = document.createElement('ul');
    statsList.classList.add('stats');
    answerDiv.appendChild(statsList);
  
  
  
    let likeIcon = createElem("img", {
      src: chrome.runtime.getURL("assets/images/thumbs-up.svg"),
    }, []);
    
  
    let likeP = createElem("p", {
     style: "margin: unset;"
    }, []);
  
    likeP.textContent += ' ' + like_amount;
  
    let likes = createElem("li", {}, [
      likeIcon,
      likeP
    ]);
  
    const likeBlock = document.createElement('li');
    likeBlock.appendChild(likes);
    statsList.appendChild(likeBlock);
  
  
    let viewIcon = createElem("img", {
      src: chrome.runtime.getURL("assets/images/eye.svg"),
    }, []);
  
    let viewP = createElem("p", {
      style: "margin: unset;"
     }, []);
   
     viewP.textContent += ' ' + amount_of_lookups;
   
    let views = createElem("li", {}, [
      viewIcon,
      viewP
    ]);
  
    
    const viewBlock = document.createElement('li');
  
    viewBlock.appendChild(views);
    statsList.appendChild(viewBlock);
  
  
  
  
    const contentTopicDiv = document.createElement('div');
    contentTopicDiv.classList.add('content_topic');
    promptPopupContentDiv.appendChild(contentTopicDiv);
  
    const form = document.createElement('form');
  
    form.addEventListener('submit', async (event) => {
      form.checkValidity();    
      event.preventDefault();
    });
  
    contentTopicDiv.appendChild(form);
  
  
    function createInput(labelText, inputType, placeholder, onValueChange, inputValue) {
      const inputDiv = document.createElement('div');
      inputDiv.classList.add('input');
  
      const inputLabel = document.createElement('label');
      inputLabel.textContent = labelText;
      inputDiv.appendChild(inputLabel);
  
      const input = document.createElement('input');
      input.type = inputType;
      input.placeholder = placeholder;
      input.required = true;
      input.value = null;
      input.name = labelText;
      input.addEventListener('input', onValueChange);
      inputDiv.appendChild(input);
  
      return inputDiv;
    }
  
    const handleInputValueChange = (e) => {
      const index = modalState.findIndex(({ variable_name }) => variable_name === e.target.name);
      modalState[index].value = e.target.value;
    }
  
    inputs.forEach(({ variable_name, placeholder }) => {
      const inputDiv = createInput(variable_name, 'text', placeholder, handleInputValueChange);
      form.appendChild(inputDiv);
    });
  
    const bottomDiv = document.createElement('div');
    bottomDiv.classList.add('bottom');
    popupContent.appendChild(bottomDiv);
  
    const sendBtn = document.createElement('button');
    sendBtn.classList.add('use_prompt');
    sendBtn.textContent = 'Send prompt';
  
    sendBtn.addEventListener('click', (e) => {
      const isValid = form.checkValidity();      
      if (!isValid) {
        form.reportValidity();
      } else {
        document.body.removeChild(popup);
        sendInput(replaceVariables(modalState, prompt_template));
  
        const observer = new MutationObserver(() => {
          const checkElements = () => {
            const matches = [];
            const divElements = document.querySelectorAll('.break-words');
            
            const divCount = divElements.length;            
            let count = divCount>= 5 ? divCount - 5 : 0;

            for (let i = count; i < divCount ; i++) {
              const div = divElements[i];
  
              const childDiv = div.querySelector('div')                  
              const innerText = childDiv?.innerText ? childDiv?.innerText: '';                      
  
              if (innerText.includes(replaceVariables(modalState, prompt_template))) {                   
              div.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                // matches.push(div);
              }
            }
  
            // if (matches.some(div => div.getAttributeNames().length === 0)) {
            //   console.log('matches___in');
            //   const lastFiveItems = matches.slice(-5);
            //   lastFiveItems.forEach(div => {
            //     div.style.display = 'none';
            //   });
            // }
          };
  
          checkElements();
        });
  
        observer.observe(document.body, { childList: true, subtree: true });
  
  
        // Ideally, we need to clear MutationObserver instance after prompt is sent but chatgpt can show our prompt in the chat after some time
        // A lot of MutationObserver can be created, and it can cause performance issues
        // 1 prompt template message = 1 MutationObserver listener
      }
    });
  
    bottomDiv.appendChild(sendBtn);
  
    return popup;
  }

let body = document.querySelector('body');

  body.addEventListener('touchstart', event => {
    console.log('touchstart');            

    // Обработчик события touchstart
    // ...
  });

    body.addEventListener('touchend', event => {
        console.log('touchend');
        // Обработчик события touchend
        // ...
    });

    body.addEventListener('touchmove', event => {
        console.log('touchmove');
        // Обработчик события touchmove
        // ...
    }
    );

    