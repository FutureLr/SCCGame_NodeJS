document.querySelector('#login-btn').addEventListener('click', () => {
    document.querySelector('#login-form-popup').classList.add('active');
});

let loginPopup = document.querySelector('#login-form-popup');
let loginForm = document.querySelector('#login-form');

loginPopup.addEventListener('click', (event) => {
    if (loginForm.contains(event.target)) {
        return;
    }
    loginPopup.classList.remove('active');
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let formData = new FormData(loginForm);
    let objData = Object.fromEntries(formData.entries());
    objData['action'] = 'login';
    let response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(objData)
    })

    if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
    }

    let data = await response.json();

    if (!data.ok) {
        document.querySelector("#login-error").classList.add('active');
    }

    let loginBtn = document.querySelector('#login-btn');
    let account = document.querySelector('#account');
    let remember = document.querySelector('#remember');

    account.innerHTML = "<img src='" + data['avatar'] + "'> <p>" + data['username'] + "</p>";

    loginBtn.classList.remove('active');
    account.classList.add('active');

    if (remember) {
        setCookie('username', data.username, "100 years");
        setCookie('password', data.password, "100 years");
    } else {
        removeCookie('username');
        removeCookie('password');
    }
});

