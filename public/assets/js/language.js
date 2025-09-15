// Lấy ngôn ngữ mặc định từ trình duyệt
function getBrowserLang() {
    let lang = navigator.language || navigator.userLanguage || "en";
    return lang.replace('_', '-').split('-')[0].toLowerCase();
}

// Tải dữ liệu ngôn ngữ từ JSON
async function loadLang(langCode) {
    let langURL = `languages/${langCode}.json`;
    try {
        let res = await fetch(langURL);
        if (!res.ok) {
            throw new Error("File does not exist: " + langURL);
        }

        let langText = await res.text();

        let langData = JSON.parse(langText);

        return langData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Cache dữ liệu ngôn ngữ vào local storage
function cacheLanguage(langCode, langData) {
    let cachedLang;
    try {
        cachedLang = JSON.parse(sessionStorage.getItem('language')) || {};
    } catch {
        cachedLang = {};
        sessionStorage.removeItem('language');
    }
    cachedLang[langCode] = langData;

    sessionStorage.setItem('language', JSON.stringify(cachedLang));
}

// Lấy dữ liệu ngôn ngữ, fallback và lưu cache
async function getLang(langCode) {
    let cachedLang;
    try {
        cachedLang = JSON.parse(sessionStorage.getItem('language')) || {};
    } catch {
        cachedLang = {};
        sessionStorage.removeItem('language');
    }

    if (!langCode) {
        langCode = localStorage.getItem('userLang');

        if (!langCode) {
            langCode = getBrowserLang();
        }
    }

    let lang;
    if (!(lang = cachedLang[langCode])) {
        if (!(lang = await loadLang(langCode))) {
            if (!(lang = cachedLang['en'])) {
                if (!(lang = await loadLang('en'))) {
                    return null;
                } else {
                    langCode = 'en';
                    cacheLanguage(langCode, lang);
                }
            } else {
                langCode = 'en';
            }
        } else {
            cacheLanguage(langCode, lang);
        }
    }

    return {
        code: langCode,
        data: lang
    }
}

// Lấy giá trị từ object theo đường dẫn key dạng "a.b.c"
function getNestedValue(object, path) {
    return path.split(".").reduce(((accumulator, key) => accumulator?.[key]), object);
}

// Áp dụng dữ liệu ngôn ngữ vào các phần tử có thuộc tính data-lang
async function applyLang(langData) {
    if (!langData) return;

    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        const value = getNestedValue(langData.data || {}, key) || "...";
        if (el instanceof HTMLInputElement) {
            el.placeholder = value;
        } else {
            el.innerText = value;
        }
    });
}

async function renderLanguageOptions() {
    try {
        let response = await fetch("/api", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'action' : 'getLangList',
            })
        });

        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }

        let data = await response.json();

        if (data.ok) {
            let langDropdown = document.querySelector("#language-dropdown");
            langDropdown.innerHTML = "";
            data.languages.forEach(lang => {
                let langOtp = document.createElement('button');
                langOtp.className = 'language-option';
                langOtp.innerText = lang.name;
                langOtp.onclick = () => {
                    changeLang(lang.code);
                }
                langDropdown.appendChild(langOtp);
            });
        }
    } catch (err) {
        console.error("Fetch error: ", err);
    }
}

// Đổi ngôn ngữ theo lựa chọn người dùng
async function changeLang(langCode) {
    if (langCode === localStorage.getItem('userLang')) {
        return;
    }

    showLoader();
    const langPromise = getLang(langCode);
    await Promise.all([
        langPromise,
        sleep(Math.random() * 1000 + 200)
    ]);
    const langData = await langPromise;
    applyLang(langData);
    localStorage.setItem('userLang',langCode);

    hideLoader();
}



window.onload = async () => {
    // Lấy và áp dụng ngôn ngữ ngay khi trang vừa load
    const langData = await getLang();
    applyLang(langData);

    renderLanguageOptions();
}