const prompsterComands = [
  { text: 'Make this more consistent', command: 'Make this more consistent' },
  { text: 'Tell me more about this', command: 'Tell me more about this' },
  { text: 'Expand details', command: 'Expand details' },
  { text: 'Give me better suggestions', command: 'Give me better suggestions' },
  { text: 'Wrap this up', command: 'Wrap this up' },
];

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
  console.log(selected_prompt);
  let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');
  document.querySelector("textarea").value = selected_prompt;
  send_button.removeAttribute('disabled');
  send_button.click();
}

function createUlFromItems(items) {
  const liItems = [];
  items.forEach(item => {
    const textNode = document.createTextNode(item.text);
    const li = createElementModal('li', { class: 'prompster-item visible', value: item.command }, [textNode]);

    liItems.push(li);
  });

  return createElementModal('ul', { id: 'prompsterList' }, liItems);
}

function filterPrompsterItems(searchText) {
  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };
  Array.from(document.querySelectorAll(".prompster-item")).forEach(item => {
    const itemText = normalizeText(item.textContent);

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
function createPrompster() {

  const prompsterInput = createElementModal('input', {
    type: 'search',
    id: 'site-search',
    name: 'prompster',
  }, []);

  prompsterInput.oninput = (e) => {
    filterPrompsterItems(e.target.value);
  };

  const ul = createUlFromItems(prompsterComands);
  const prompster = createElementModal('div', { id: 'prompster', class: 'prompster' }, [ul, prompsterInput]);
  ul.querySelectorAll('.prompster-item').forEach((li) => {
    li.onclick = () => {
      sendModalInput(li.innerText);
      prompster.classList.remove('active');
      ul.classList.remove('active');
    };
  })

  return prompster;
}

function addPrompster() {
  const container = document.querySelector('textarea').parentElement;
  container.appendChild(createPrompster());
  const textArea = document.querySelector('textarea');
  const selectorPromster = document.querySelector("#prompster");
  const selectorUlPromster = selectorPromster.querySelector("ul");
  const search = document.getElementById('site-search');

  search.addEventListener('keydown', (e) => {

    if (e.key == 'Enter') {
      e.preventDefault();
      document.querySelector('.prompster-item.visible').click();

    }
  })

  search.addEventListener('blur', () => {
    setTimeout(() => {
      selectorPromster.classList.remove('active');
      selectorUlPromster.classList.remove('active');
    }, 100);
  });

  textArea.addEventListener('keydown', function (e) {
    if (e.key === '/' && textArea.value.length == 0) {
      e.preventDefault();
      selectorPromster.classList.add('active');
      selectorUlPromster.classList.add('active');
      search.focus();
    }
  });
  
  

}

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

observer.observe(document.body, { childList: true, subtree: true });
