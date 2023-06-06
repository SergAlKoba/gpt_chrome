function createInput(type, placeholder) {
    const div = document.createElement('div');
    div.className = 'input';
    const label = document.createElement('label');
    label.innerText = type.charAt(0).toUpperCase() + type.slice(1) + ' address';
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;

    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function createPopup(type) {
    const div = document.createElement('div');
    div.className = 'popup ' + type + '_popup';

    const close = document.createElement('span');
    close.className = 'close';

    const popupContent = document.createElement('div');
    popupContent.className = 'popup_content';

    const closePopup = document.createElement('span');
    closePopup.className = 'close_popup';

    const img = document.createElement('img');
    img.src = 'assets/images/close.svg';
    img.alt = '';
    closePopup.appendChild(img);

    const title = document.createElement('div');
    title.className = 'title';

    const h5 = document.createElement('h5');
    h5.innerText = type.charAt(0).toUpperCase() + type.slice(1);
    const p = document.createElement('p');
    p.innerText = type === 'sign_up' ? 'Get started for free. No credit card required.' : 'Sign in with Google or email to continue.';

    title.appendChild(h5);
    title.appendChild(p);

    const form = document.createElement('form');
    form.appendChild(createInput('email', 'acme@corp.ai'));
    form.appendChild(createInput('password', 'Enter password here'));

    if (type === 'sign_up') {
        form.appendChild(createInput('password', 'Enter password here'));
    }

    const button = document.createElement('button');
    button.innerText = type.charAt(0).toUpperCase() + type.slice(1);

    form.appendChild(button);

    popupContent.appendChild(closePopup);
    popupContent.appendChild(title);
    popupContent.appendChild(form);
    div.appendChild(close);
    div.appendChild(popupContent);

    return div;
}

const signUpPopup = createPopup('sign_up');
const signInPopup = createPopup('sign_in');

document.body.appendChild(signUpPopup);
document.body.appendChild(signInPopup);
