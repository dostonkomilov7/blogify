
const apiUrl = import.meta.env.VITE_apiUrl_URL;

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

export const register = async (name, email, username, age, password) => {
    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, username, age, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};
