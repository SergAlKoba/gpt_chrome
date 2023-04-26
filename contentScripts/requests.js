const API_URL = "127.0.0.1:8080";
const TOKEN = localStorage.getItem('token');

function getCategories() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch("/api/shop/get-categories/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function getPromptsByCategory(categoryIds, name) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let result_url = API_URL + '/api/shop/search/?';
    if (name) {
        result_url += `name=${name}&`;
    }
    if (categoryIds) {
        categoryIds.forEach(id => {
            result_url += `categories=${id}&`;
        });
    }
    return fetch(result_url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function getFavorites() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(API_URL + "/api/chat/get-favorites/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function getBookmarks() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(API_URL + "/api/chat/get-bookmarks/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function createBookmark(output) {
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

    fetch(API_URL + "api/chat/create-bookmark/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function createFavourite(prompt) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var raw = JSON.stringify({
        "prompt": prompt
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(API_URL + "api/chat/create-favourite/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function logout() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);



    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(API_URL + "/api/user/logout/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function login(email, password) {

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        redirect: 'follow'
    };

    response = fetch(API_URL + "/api/user/login/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    console.log(response);
    localStorage.setItem('token', response.auth_token);
    return response;
}

function register(email, username, password) {
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            "username": username,
            "email": email,
            "password": password
        }),
        redirect: 'follow'
    };

    response = fetch(API_URL + "/api/user/register/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    console.log(response);
    localStorage.setItem('token', response.auth_token);
    return response;
}

function setPromptText(style = none, text = none, tone = none, result_amount = none) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `token ${localStorage.getItem('token')}`);

    var raw = JSON.stringify({
        "style": style,
        "tone": tone,
        "result_amount": result_amount,
        "text": text
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(API_URL + "/api/shop/get-result-prompt/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}