const container = document.querySelector('textarea').parentElement;

function sendModalInput(selected_prompt) {
  console.log(selected_prompt);
  let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button');

  document.querySelector("textarea").value = selected_prompt;
  send_button.removeAttribute('disabled');
  send_button.click();
}

const items = [
  'Make this more consistent',
  'Tell me more about this',
  'Expand details',
  'Give me better suggestions',
  'Wrap this up',
];

let elements = [{
    'text': 'Make this more consistent',
    'command': 'Make this more consistent'
  },
  {
    'text': 'Tell me more about this',
    'command': 'Tell me more about this'
  },
  {
    'text': 'Expand details',
    'command': 'Expand details'
  },
  {
    'text': 'Give me better suggestions',
    'command': 'Give me better suggestions'
  },
  {
    'text': 'Wrap this up',
    'command': 'Wrap this up'
  },
];
createUlFromItems(items);

let ul = document.createElement('ul');
for (let i = 0; i < elements.length; i++) {
  let li = document.createElement('li');
  li.classList.add('prompster-item');
  li.innerHTML = elements[i].text;
  ul.appendChild(li);
  li.addEventListener('click', () => {
    sendModalInput(elements[i].command)
    selectorPromster.classList.remove('active');
    selectorUlPromster.classList.remove('active');
  });
}

let prompster = document.createElement('div');
prompster.classList.add('prompster');
prompster.appendChild(ul);

let prompster_input = document.createElement('input');
prompster_input.setAttribute('type', 'search');
prompster_input.setAttribute('id', 'site-search');
prompster_input.setAttribute('name', 'prompster');
prompster.appendChild(prompster_input);
prompster_input.oninput = (e) => {
  filterPrompterItems(e.target.value);
};

function filterPrompterItems(searchText) {
  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };
  Array.from(document.querySelectorAll(".prompster-item")).forEach(item => {
    const itemText = normalizeText(item.textContent);

    const searchRegExp = new RegExp(normalizeText(searchText), 'g');
    if (!itemText.match(searchRegExp)) {
      item.style.display = "none";
    } else {
      item.style.display = "list-item";
    }

  });

}

// container.insertAdjacentHTML('afterbegin', prompster);
container.appendChild(prompster);
const textArea = document.querySelector('textarea')
const selectorPromster = document.querySelector(".prompster");
const selectorUlPromster = selectorPromster.querySelector("ul");
const search = document.getElementById('site-search');

search.addEventListener('blur', () => {
  selectorPromster.classList.remove('active');
  selectorUlPromster.classList.remove('active');
});


setInterval(() => {
  textArea.addEventListener('input', function () {
    if (textArea.value == '/') {
      selectorPromster.classList.add('active');
      selectorUlPromster.classList.add('active');
      // search.focus();
    } else {
      console.log('not /', textArea.value);
    }
  });
}, 1000);