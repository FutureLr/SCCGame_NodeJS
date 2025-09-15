document.querySelector("#genre-toggle-btn").addEventListener("click", () => {
    let genreList = document.querySelector("#genre-list");
    let gameGrid = document.querySelector("#game-grid");
    if (genreList.classList.contains("active")) {
        gameGrid.classList.remove("with-sidebar");
        genreList.classList.remove("active");
    } else {
        gameGrid.classList.add("with-sidebar");
        genreList.classList.add("active");
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showLoader() {
    document.querySelector('#loader').classList.add('active');
}

async function hideLoader() {
    document.querySelector('#loader').classList.remove('active');
}

function setCookie(key, value, lifespan = "7 days") {
    let expiryDate = new Date();

    const regex = /^\d+\s+(minute|minutes|hour|hours|day|days|month|months|year|years)$/i;

    if (!regex.test(lifespan)) {
        throw new Error(
            `Invalid lifespan format: "${lifespan}".\n` +
            `Expected format: "<number> <unit>"\n` +
            `Units supported: minutes, hours, days, months, years\n` +
            `Examples: "30 minutes", "2 hours", "7 days", "3 months", "1 year"`
        );
    }

    let [amount, unit] = lifespan.split(' ');
    amount = Number(amount);

    switch (unit.toLowerCase()) {
        case 'minute':
        case 'minutes':
            expiryDate.setMinutes(expiryDate.getMinutes() + amount);
            break;
        case 'hour':
        case 'hours':
            expiryDate.setHours(expiryDate.getHours() + amount);
            break;
        case 'day':
        case 'days':
            expiryDate.setDate(expiryDate.getDate() + amount);
            break;
        case 'month':
        case 'months':
            expiryDate.setMonth(expiryDate.getMonth() + amount);
            break;
        case 'year':
        case 'years':
            expiryDate.setFullYear(expiryDate.getFullYear() + amount);
            break;
    }

    let expires = "expires=" + expiryDate.toUTCString();
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; ${expires}; path=/`;
}


function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let c of cookies) {
        let [key, value] = c.split("=");
        if (key === name) return value;
    }
    return null;
}

function removeCookie(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


