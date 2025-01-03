export function loadLogin() {
    // Login Section HTML'i oluştur
    const loginSection = document.getElementById('login-section');

    if (loginSection) {
        loginSection.innerHTML = `
            <div class="login-container">
                <h2>Admin Login</h2>
                <form id="login-form">
                    <label for="username">Benutzername</label>
                    <input type="text" id="username" name="username" placeholder="Benutzername" required>

                    <label for="password">Passwort</label>
                    <input type="password" id="password" name="password" placeholder="Passwort" required>

                    <button type="submit" id="login-button">Einloggen</button>
                </form>
                <p id="login-message"></p>
            </div>
        `;

        // Login form olaylarını ekle
        const loginForm = document.getElementById("login-form");
        const loginMessage = document.getElementById("login-message");

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            // Basit bir kontrol (gerçek bir veritabanı kontrolü yer almadığından, bu kısmı örnek olarak yapıyoruz)
            if (username === "admin" && password === "admin123") {
                loginMessage.textContent = "Login erfolgreich!";
                loginMessage.style.color = "green";

                // Admin işlemlerine yönlendirme veya izin verme
                // Örnek olarak: window.location.href = "admin-dashboard.html";
            } else {
                loginMessage.textContent = "Benutzername oder Passwort ist falsch.";
                loginMessage.style.color = "red";
            }
        });
    }
}


/* Başarılı giriş sonrası yönlendirme */
window.addEventListener("load", () => {
  const loginButton = document.getElementById("login-button");
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      if (username === "admin" && password === "admin") {
        document.getElementById("login-message").textContent = "Login erfolgreich!";
        document.getElementById("login-message").classList.add("admin-redirect");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        document.getElementById("login-message").textContent = "Falscher Benutzername oder Passwort.";
        document.getElementById("login-message").style.color = "red";
      }
    });
  }
});