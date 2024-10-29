export function loadRegister() {
    // Register Section HTML oluştur
    const registerSection = document.getElementById('register-section');

    if (registerSection) {
        registerSection.innerHTML = `
            <div class="login-container">
                <h2>Registrierung</h2>
                <form id="register-form">
                    <label for="username">Benutzername</label>
                    <input type="text" id="register-username" name="username" placeholder="Benutzername" required>

                    <label for="password">Passwort</label>
                    <input type="password" id="register-password" name="password" placeholder="Passwort" required>

                    <button type="submit" id="register-button">Registrieren</button>
                </form>
                <p id="register-message"></p>
            </div>
        `;

        // Register form olaylarını ekle
        const registerForm = document.getElementById("register-form");
        const registerMessage = document.getElementById("register-message");

        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const username = document.getElementById("register-username").value.trim();
            const password = document.getElementById("register-password").value.trim();

            // Kullanıcıyı LocalStorage'a kaydet
            if (username && password) {
                localStorage.setItem(username, password);
                registerMessage.textContent = "Registrierung erfolgreich!";
                registerMessage.style.color = "green";
            } else {
                registerMessage.textContent = "Bitte geben Sie gültige Informationen ein.";
                registerMessage.style.color = "red";
            }
        });
    }
}
