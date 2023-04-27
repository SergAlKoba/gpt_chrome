const API_URL = "https://gotgood.ai";
const TOKEN = localStorage.getItem('token');

async function getCategories() {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  
    let response = await fetch(API_URL + "/api/shop/get-categories/", requestOptions)
    let result = await response.json();
    console.log(result);
    sessionStorage.setItem("categories", JSON.stringify(result.results));
    return response;
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
        .then(result => {
            console.log(result.results);
            localStorage.setItem("categories", JSON.stringify(result.results))
        })
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

async function login(email, password) {

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        redirect: 'follow'
    };
    let response = fetch(API_URL + "/api/user/login/", requestOptions)
        .catch(error => console.log('error', error));
    let result = await response.json();
    localStorage.setItem('token', result.auth_token);
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