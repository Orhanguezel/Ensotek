export function loadFooter() {
  const footer = document.getElementById("footer");
  // Şu anki sayfanın adını belirleyin
  const currentPage = window.location.pathname.split("/").pop();
  
  // Sayfaya göre farklı linkler tanımlayın
  const linkPrefix = currentPage === "index.html" ? "" : "index.html";
  footer.innerHTML = `
        
      <!-- Footer Section -->
      <footer class="footer">
        <div class="logo-container">
          <div class="logo-footer">
            <img src="assets/img/LOGO2/7.png" alt="ENSOTEK Logo" />
          </div>
        </div>

        <!-- Footer Content -->
        <div class="footer-content">
          <!-- About Us Section -->
          <div class="footer-section">
            <h3>Über Uns</h3>
            <ul>
              <li><a href="${linkPrefix}#uber-uns">Über Uns</a></li>
              <li><a href="${linkPrefix}#vision">Vision und Mission</a></li>
              <li><a href="${linkPrefix}#geschichte">Unsere Geschichte</a></li>
              <li><a href="${linkPrefix}#referenzen">Referenzen</a></li>
              <li><a href="angebot.html">Kontakt</a></li>
            </ul>
          </div>

          <!-- Contact Info Section -->
          <div class="footer-section">
            <h3>Kontakt Informationen</h3>
            <p>Wir freuen uns auf Ihre Nachricht!</p>
            <p>Adresse: 22. Straße, Grevenbroich</p>
            <p>Email: orhanguzell@gmail.com</p>
            <p>Telefon: +49-123-456-78</p>
          </div>

          <!-- Services Section -->
          <div class="footer-section">
            <h3>Unsere Dienstleistungen</h3>
            <ul>
              <li><a href="produkte.html">Produkte</a></li>
              <li><a href="materialien.html">Turmmaterialien</a></li>
              <li><a href="artikel.html">Artikel</a></li>
              <li><a href="angebot.html">Ein Angebot bekommen</a></li>
            </ul>
          </div>
        </div>

        <!-- Social Media and Copyright -->
        <div class="footer-bottom">
          <div class="social-media">
            <a href="https://www.instagram.com/kazatlet?igsh=eWkyaWNydWhteG1t" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com/in/orhan-g%C3%BCzel-53b47b11a/" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>
          </div>
          <p class="copyright">
            Copyright © 2024 Ensotek Kühlturm GmbH. Alle Rechte vorbehalten.
          </p>
          <!-- Designed by Link -->
          <a href="https://www.guezelwebdesign.com" target="_blank" rel="noopener noreferrer" class="designed-by-link">
            Designed by OG
          </a>

            
          

        </div>
      </footer>
    `;
}
document.addEventListener("DOMContentLoaded", loadFooter);
