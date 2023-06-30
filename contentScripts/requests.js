async function getCategories() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    let response = await fetch(API_URL + "/api/shop/get-categories/", requestOptions)
    let result = await response.json();
    console.log(result);
    sessionStorage.setItem("categories", JSON.stringify(result.results));
    return result;
}

//     let response = await fetch(API_URL + "/api/shop/get-categories/", requestOptions)
//     let result = await response.json();
//     console.log(result);
//     sessionStorage.setItem("categories", JSON.stringify(result.results));
//     return result.results;
// }

// async function getPromptsByCategory(categoryId) {
//     var requestOptions = {
//         method: 'GET',
//         redirect: 'follow'
//     };
//     let response = await fetch(`https://gotgood.ai/get-extension-prompt-by-category/${categoryId}`, requestOptions);
//     let result = await response.json();
//     console.log(result);
//     return result;
// }

async function getFavorites() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai//api/chat/get-favorites/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    let result = await response.json();
    return result;

}

async function getBookmarks() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai/api/chat/get-bookmarks/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    let result = await response.json();
    return result;
}

async function createBookmark(output) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var raw = JSON.stringify({
        "output": output
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://gotgood.ai/api/chat/create-bookmark/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

async function createFavourite(prompt) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var raw = JSON.stringify(
         prompt
    );

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai/api/chat/prompt-favourite/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    let result = await response.json();
    return result;
}

async function createLike(prompt) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var raw = JSON.stringify(
         prompt
    );

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let response = await fetch("https://gotgood.ai/api/shop/prompt-like/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    let result = await response.json();
    return result;
}


async function logout() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);



    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let response = await fetch(API_URL + "/api/user/logout/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    let result = await response.json();
    return result;
}

// async function login(email, password) {

//     var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: JSON.stringify({
//             "email": email,
//             "password": password
//         }),
//         redirect: 'follow'
//     };
//     let response = await fetch("https://gotgood.ai/api/user/login/", requestOptions)
//         .catch(error => console.log('error', error));
//     let result = await response.json();
//     localStorage.setItem('token', result.auth_token);
//     return result;
// }

// async function register(email, password, username) {
//     console.log('register___1')
//     var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: JSON.stringify({
//             "username": username,
//             "email": email,
//             "password": password
//         }),
//         redirect: 'follow'
//     };

//     let response = await fetch(API_URL + "/api/user/register/", requestOptions)
//         .then(response => response.text())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));
//     let result = await response.json();
//     console.log(response);
//     localStorage.setItem('token', result.auth_token);
//     return result;
// }

function send_gpt_request(){
    let input = document.querySelector('textarea')
    input.value = 'test';
    let send_button = document.querySelector('form > div > div.flex.flex-col.w-full.py-2.flex-grow.rounded-md> button')
    send_button.click()
}



async function setPromptText(style = none, text = none, tone = none, result_amount = none, iclude_google_data=false) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "style": style,
        "tone": tone,
        "result_amount": result_amount,
        "text": text,
        "iclude_google_data": iclude_google_data
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let response = await fetch(API_URL + "/api/shop/get-result-prompt/", requestOptions)
    let result = await response.json();
    console.log(response);
    localStorage.setItem('token', result.auth_token);
    return result;
}

