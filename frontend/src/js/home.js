document.getElementById('exit-btn').addEventListener('click', () => {
    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")
    window.location.href = "/";
});
