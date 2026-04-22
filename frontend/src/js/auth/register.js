import { register, setCookie, redirectIfAuth } from '../main.js';

redirectIfAuth();

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = e.target[0].value;
    const email = e.target[1].value;
    const age = Number(e.target[2].value);
    const username = e.target[3].value;
    const password = e.target[4].value;

    const response = await register(fullName, email, username, age, password);

    if (response?.success) {
        setCookie("accessToken", response.accessToken);
        setCookie("refreshToken", response.refreshToken);
        window.location.href = "/src/page/home-page.html";
    } else {
        alert(response?.message || "Registration failed");
    }
});
