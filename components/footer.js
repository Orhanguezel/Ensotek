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
            <p>Center: Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41 34235 Esenler / İSTANBUL - TÜRKİYE <br>
            <br>
            Factory: Saray Mah. Gimat Cad. No:6A 06980 Kahramankazan / ANKARA - TÜRKİYE</p>
            <p>Email: ensotek@ensotek.com.tr</p>
            <p>Telefon: +90 212 613 33 01</p>
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
            <a href="https://www.facebook.com/Ensotek/" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/ensotekcoolingtowers/" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com/company/ensotek-su-so-utma-kuleleri-ltd-ti-/" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>
            <a href="https://www.youtube.com/channel/UCX22ErWzyT4wDqDRGN9zYmg" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a>
            <a href="https://x.com/Ensotek_Cooling" target="_blank" rel="noopener noreferrer"><i class="fab fa-xing"></i></a>
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
