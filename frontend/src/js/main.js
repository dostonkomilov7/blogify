const apiUrl = import.meta.env.VITE_API_URL;

export const setCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/`;
};

export const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    for (let c of cookies) {
        const [key, value] = c.split('=');
        if (key === name) return value;
    }
    return null;
};

// Agar token bo'lsa — login/register sahifasiga kira olmasin
export const redirectIfAuth = () => {
    if (getCookie("accessToken")) {
        window.location.href = "/src/page/home-page.html";
    }
};

// Agar token yo'q bo'lsa — home sahifasiga kira olmasin
export const redirectIfNotAuth = () => {
    if (!getCookie("accessToken")) {
        window.location.href = "/src/page/login-page.html";
    }
};