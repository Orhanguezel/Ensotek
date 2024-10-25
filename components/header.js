export function loadHeader() {
  const header = document.getElementById("header");
  header.innerHTML = `
      <header>
          <div class="kuhlturm-header">
              <div class="kuhlturm-header-top">
                  <a href="#"> <img src="assets/img/LOGO2/7.png" alt="KKL Logo" class="kuhlturm-logo"></a>
                  <div class="kuhlturm-top-links">
                      <a href="#"><i class="fas fa-sitemap"></i> Sitemap</a> |
                      <a href="#"><i class="fas fa-user"></i> Login</a> | 
                      <a href="#"><i class="fas fa-search"></i> Suche</a>
                  </div>
                  <div class="kuhlturm-mobile-menu-button" id="menu-toggle">
                      <span class="bar"></span>
                      <span class="bar"></span>
                      <span class="bar"></span>
                  </div>
              </div>
              <nav class="kuhlturm-main-nav" id="main-nav">
                  <ul>
                      <!-- Unternehmen Menüsü -->
                      <li class="kuhlturm-dropdown">
                          <a href="#" class="kuhlturm-nav-button" id="Unternehmen">
                              <i class="fas fa-briefcase"></i> Unternehmen
                          </a>
                          <div class="kuhlturm-dropdown-content ">
                              <div class="kuhlturm-dropdown-row">
                                  <!-- Leitbild und Geschäftsprinzipien -->
                                  <div class="kuhlturm-dropdown-column unternehmen-dropdown">
                                      <ul>
                                          <li><a href="#" class="upper-level">Über Uns</a>
                                              <ul>
                                                  <li><a href="#">Vision und Mission</a></li>   
                                                  <li><a href="#">Zertifikate</a></li>
                                                  <li><a href="#">Referenzen</a></li>
                                                  <li><a href="#">Kontakt</a></li>
                                                  <li><a href="#">Galeri</a></li>

                                              </ul>
                                          </li>
                                          <li><a href="#" class="upper-level">Organisation</a>
                                              <ul>
                                                  <li><a href="#">Unsere Aktivitäten</a></li>
                                                  <li><a href="#">Unser Team</a></li>
                                                  <li><a href="#">Unsere Geschichte</a></li>
                                              </ul>
                                          </li>
                                          <li><a href="#" class="upper-level">Neuigkeiten</a>
                                              <ul>
                                                  <li><a href="#">Last Neuigkeiten</a></li>
                                                  <li><a href="#">Arsiv</a></li>
                                              </ul>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </li>
                      <!-- Bibliothek Menüsü -->
                      <li class="kuhlturm-dropdown">
                          <a href="#" class="kuhlturm-nav-button" id="Bibliothek">
                              <i class="fas fa-atom"></i> Bibliothek
                          </a>
                          <div class="kuhlturm-dropdown-content">
                              <div class="kuhlturm-dropdown-row">
                                  <!-- Bibliotek -->
                                  <div class="kuhlturm-dropdown-column bibliothek-dropdown">
                                      <ul>
                                          <li><a href="#" class="upper-level">Artikel</a>
                                              <ul>
                                                  <li><a href="#">Was ist eine Wasserkühlanlage?</a></li>
                                                  <li><a href="#">Eigenschaften der Ensotek Kühltürme</a></li>
                                                  <li><a href="#">Erforderliche Informationen für die Auswahl eines Kühlturms</a></li>
                                                  <li><a href="#">Offener Kühlkreislaufturm Funktionsprinzip</a></li>
                                                  <li><a href="#">Funktionsprinzip des geschlossenen Kreislauf-Kühlturms</a></li>
                                                  <li><a href="#">Feuchtkugeltemperatur Rechner</a></li>
                                                  <li><a href="#">Feuchtkugeltemperatur in nach Städten</a></li>
                                              </ul>
                                          </li>
                                          <li><a href="#" class="upper-level">Produkte</a>
                                              <ul>
                                                  <li><a href="#">Kühlturm Mit Offenem Kreislauf</a></li>
                                                  <li><a href="#">Geschlossener Kreislaufkühlturm</a></li>
                                                  <li><a href="#">Service und Wartung</a></li>
                                                  <li><a href="#">Mietkühltürme</a></li>
                                                  <li><a href="#">Verdunstungskondensator</a></li>
                                                  <li><a href="#">Kühlturmwasseraufbereitung</a></li>
                                              </ul>
                                          </li>
                                          <li><a href="#" class="upper-level">Turmmaterialien</a>
                                              <ul>
                                                  <li><a href="#">Wasserkühlturmmotor Getriebe Lüfter</a></li>
                                                  <li><a href="#">Axialventilator (Lüfter) für Kühltürme</a></li>
                                                  <li><a href="#">Vibrationsschalter</a></li>
                                                  <li><a href="#">Drift Eliminator</a></li>
                                                  <li><a href="#">Wasserverteilungssystem</a></li>
                                                  <li><a href="#">Kühlturmdüse</a></li>
                                                  <li><a href="#">Servicefenster</a></li>
                                                  <li><a href="#">Spritzgitter Kühlturmfüllung</a></li>
                                                  <li><a href="#">Wasserkühlturmpumpe</a></li>
                                                  <li><a href="#">Plattenwärmetauscher</a></li>
                                              </ul>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </li>
                      <!-- Besucherangebote Menüsü -->
                      <li class="kuhlturm-dropdown">
                          <a href="#" class="kuhlturm-nav-button" id="Hilfmittel">
                              <i class="fas fa-users"></i>Hilfmittel
                          </a>
                          <div class="kuhlturm-dropdown-content">
                              <div class="kuhlturm-dropdown-row">
                                  <!-- Infozentrum -->
                                  <div class="kuhlturm-dropdown-column hilfmittel-dropdown">
                                      <ul>
                                          <li><a href="#" class="upper-level">Hilfmittel</a>
                                              <ul>
                                                  <li><a href="#">FAQ</a></li>
                                                  <li><a href="#">Glossar der Kühltechnologien</a></li>
                                                  <li><a href="#">Technische Artikel</a></li>
                                              </ul>
                                          </li>
                                          <li><a href="#" class="upper-level">Reservierter Bereich</a>
                                              <ul>
                                                  <li><a href="#">Bewerbung</a></li>
                                                  <li><a href="#">Partnerschaft</a></li>
                                                  <li><a href="#">Ein Angebot bekommen</a></li>
                                                  <li><a href="#">Nach Informationen fragen</a></li>
                                              </ul>
                                          </li>
                                           <li><a href="#" class="upper-level">Downloads</a>
                                              <ul>
                                                  <li><a href="#">Broschüren</a></li>
                                                  <li><a href="#">Bilddatenbank</a></li>
                                              </ul>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>


                      </li>
                  </ul>
              </nav>
          </div>
      </header>
      `;

  // FontAwesome ikonu kullanabilmek için kütüphaneyi dahil et
  const fontAwesomeLink = document.createElement("link");
  fontAwesomeLink.rel = "stylesheet";
  fontAwesomeLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
  document.head.appendChild(fontAwesomeLink);

  // Dropdown menülerin başlangıçta kapalı olması için
  const dropdowns = document.querySelectorAll(".kuhlturm-dropdown-content");
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("kuhlturm-show"); // Başlangıçta kapalı olacak
  });

  // Dropdown menü açma/kapama
  const dropdownItems = document.querySelectorAll(".kuhlturm-dropdown");
  dropdownItems.forEach((dropdown) => {
    const button = dropdown.querySelector(".kuhlturm-nav-button");
    const content = dropdown.querySelector(".kuhlturm-dropdown-content");

    button.addEventListener("click", (event) => {
      event.preventDefault();
      dropdownItems.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown
            .querySelector(".kuhlturm-dropdown-content")
            .classList.remove("kuhlturm-show");
        }
      });
      content.classList.toggle("kuhlturm-show");
    });
  });

  // Mobil menü açma/kapatma işlevselliği ve animasyonlar
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const bars = document.querySelectorAll(".bar");

  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("kuhlturm-mobile-visible");
    menuToggle.classList.toggle("open");

    // Hamburger menünün çubuklarının animasyonu
    bars.forEach((bar, index) => {
      if (index === 0) {
        bar.classList.toggle("rotate-down");
      } else if (index === 1) {
        bar.classList.toggle("hide");
      } else if (index === 2) {
        bar.classList.toggle("rotate-up");
      }
    });
  });
}
