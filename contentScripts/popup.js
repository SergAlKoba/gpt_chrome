

async function login(email, password) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai/api/user/login/", requestOptions)
        .catch(error => console.log('error', error));
    let result = await response.json();

    console.log(result);

    if (result.user) {
        localStorage.setItem('token', result.auth_token);

        const registrationElement = document.querySelector('.registration');
        const promptBarElement = document.querySelector('.prompt_bar');
        if (registrationElement && promptBarElement) {
            registrationElement.classList.remove('active');
            promptBarElement.classList.add('active');
        }
    } else {
        let er = (result?.email ? result.email.join(', ') : null) ?? (result?.password ? result.password.join(', ') : null) ?? (result?.non_field_errors ? result.non_field_errors.join(', ') : null) ?? result?.info ?? result?.error;
        $('html').find('.authError').html(er);
        console.log(er);
    }

    return result;
}

async function register(email, password, confirmPassword) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            "email": email,
            "password": password,
            "confirmPassword": confirmPassword
        }),
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai/api/user/register/", requestOptions)
        .catch(error => console.log('error', error));
    let result = await response.json();

    if (response.ok) {
        localStorage.setItem('token', result.auth_token);

        const registrationElement = document.querySelector('.registration');
        const promptBarElement = document.querySelector('.prompt_bar');
        if (registrationElement && promptBarElement) {
            registrationElement.classList.remove('active');
            promptBarElement.classList.add('active');
        }
    }

    return result;
}


function createInput(type, placeholder, labelName) {
    const div = document.createElement('div');
    div.className = 'input';
    const label = document.createElement('label');
    label.innerText = labelName || type.charAt(0).toUpperCase() + type.slice(1);
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;

    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function createForm(type, submitFunction) {
    const form = document.createElement('form');
    const emailInput = createInput('email', 'acme@corp.ai');
    const passwordInput = createInput('password', 'Enter password here');

    form.appendChild(emailInput);
    form.appendChild(passwordInput);

    if (type === 'sign_up') {
        const confirmPasswordInput = createInput('password', 'Confirm password here', 'Confirm Password');
        form.appendChild(confirmPasswordInput);
    }

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = (type.charAt(0).toUpperCase() + type.slice(1)).replace('_', ' ');
    form.appendChild(submitButton);

    const errorP = document.createElement('p');
    errorP.setAttribute('class', 'authError');
    form.appendChild(errorP);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.children[1].value;
        const password = passwordInput.children[1].value;

        let result;
        if (type === 'sign_up') {
            const confirmPasswordInput = form.querySelector('input[type="password"]:nth-child(2)');
            const confirmPassword = confirmPasswordInput.value;
            if (password === confirmPassword) {
                result = await submitFunction(email, password);
            } else {
                alert("Passwords do not match.");
                return;
            }
        } else {
            result = await submitFunction(email, password);
        }


        if (result && result.auth_token) {
            document.querySelector('.popup').style.display = 'none';
        }
    });


    return form;
}

function createPopup(type) {
    const submitFunction = type === 'sign_up' ? register : login;
    const form = createForm(type, submitFunction);

    const div = document.createElement('div');
    div.className = 'popup ' + type + '_popup';

    const close = document.createElement('span');
    close.className = 'close';

    const popupContent = document.createElement('div');
    popupContent.className = 'popup_content';

    const closePopup = document.createElement('span');
    closePopup.className = 'close_popup';

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('assets/images/close.svg');
    img.alt = '';
    closePopup.appendChild(img);

    const title = document.createElement('div');
    title.className = 'title';

    const h5 = document.createElement('h5');
    h5.innerText = (type.charAt(0).toUpperCase() + type.slice(1)).replace('_', ' ');
    const p = document.createElement('p');
    p.innerText = type === 'sign_up' ? 'Get started for free. No credit card required.' : 'Sign in with Google or email to continue.';

    title.appendChild(h5);
    title.appendChild(p);

    const orSpan = document.createElement('span');
    orSpan.innerText = 'or';

    const signGoogleLink = document.createElement('a');
    signGoogleLink.href = 'javascript:void(0)';
    signGoogleLink.className = 'sign_google';
    const signGoogleImg = document.createElement('img');
    signGoogleImg.src = chrome.runtime.getURL('assets/images/sign_google.png');
    signGoogleImg.alt = '';
    signGoogleLink.appendChild(signGoogleImg);
    signGoogleLink.appendChild(document.createTextNode(' Sign up with Google'));

    const signCredentialsLink = document.createElement('a');
    signCredentialsLink.href = 'javascript:void(0)';
    signCredentialsLink.className = 'sign_credentials';
    const signCredentialsImg = document.createElement('img');
    signCredentialsImg.src = chrome.runtime.getURL('assets/images/sign_credentials.svg');
    signCredentialsImg.alt = '';
    signCredentialsLink.appendChild(signCredentialsImg);
    signCredentialsLink.appendChild(document.createTextNode(' Sign up with Credentials'));

    const existingAccountText = document.createElement('p');
    existingAccountText.innerHTML = 'Already registered? <a class="sign_in_js" href="javascript:void(0)">Sign in</a> to your account.';

    form.appendChild(orSpan);
    form.appendChild(signGoogleLink);
    form.appendChild(signCredentialsLink);
    form.appendChild(existingAccountText);

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
