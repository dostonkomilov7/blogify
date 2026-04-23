import { redirectIfAuth, setCookie } from "../main.js";
const apiUrl = import.meta.env.VITE_API_URL;

redirectIfAuth();

const login = async (email, password) => {
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    const response = await login(email, password);

    if (response?.success) {
        setCookie("accessToken", response.accessToken);
        setCookie("refreshToken", response.refreshToken);
        setCookie("userId", response.userId);
        window.location.href = "/src/page/home-page.html";
    } else {
        alert(response?.message || "Registration failed");
    }
});