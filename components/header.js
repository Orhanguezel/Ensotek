export function loadHeader() {
    const header = document.getElementById("header");
    header.innerHTML = `
        <header>
            <div class="kuhlturm-header">
                <div class="kuhlturm-header-top">
                    <a href="index.html"> 
                        <img src="assets/img/LOGO2/7.png" alt="KKL Logo" class="kuhlturm-logo">
                    </a>
                    <div class="kuhlturm-top-links">
                        <a href="sitemap.html"><i class="fas fa-sitemap"></i> Sitemap</a> |
                        <a href="login.html"><i class="fas fa-user"></i> Login</a> | 
                        <a href="search.html"><i class="fas fa-search"></i> Suche</a>
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
                            <a href="unternehmen.html" class="kuhlturm-nav-button" id="Unternehmen">
                                <i class="fas fa-briefcase"></i> Unternehmen
                            </a>
                            <div class="kuhlturm-dropdown-content">
                                <div class="kuhlturm-dropdown-row">
                                    <!-- Leitbild und Geschäftsprinzipien -->
                                    <div class="kuhlturm-dropdown-column unternehmen-dropdown">
                                        <ul>
                                            <li><a href="uber-uns.html" class="upper-level">Über Uns</a>
                                                <ul>
                                                    <li><a href="#vision">Vision und Mission</a></li>   
                                                    <li><a href="zertifikate.html">Zertifikate</a></li>
                                                    <li><a href="referans.html">Referenzen</a></li>
                                                    <li><a href="kontakt.html">Kontakt</a></li>
                                                    <li><a href="galerie.html">Galerie</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="organisation.html" class="upper-level">Organisation</a>
                                                <ul>
                                                    <li><a href="unsere-aktivitaten.html">Unsere Aktivitäten</a></li>
                                                    <li><a href="unser-team.html">Unser Team</a></li>
                                                    <li><a href="geschichte.html">Unsere Geschichte</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="news.html" class="upper-level">Neuigkeiten</a>
                                                <ul>
                                                    <li><a href="#latest-news-home">Last Neuigkeiten</a></li>
                                                    <li><a href="#arsiv">Archiv</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <!-- Bibliothek Menüsü -->
                        <li class="kuhlturm-dropdown">
                            <a href="bibliothek.html" class="kuhlturm-nav-button" id="Bibliothek">
                                <i class="fas fa-atom"></i> Bibliothek
                            </a>
                            <div class="kuhlturm-dropdown-content">
                                <div class="kuhlturm-dropdown-row">
                                    <!-- Bibliotek -->
                                    <div class="kuhlturm-dropdown-column bibliothek-dropdown">
                                        <ul>
                                            <li><a href="artikel.html" class="upper-level">Artikel</a>
                                                <ul>
                                                    <li><a href="artikel.html#wasserkuehlanlage">Was ist eine Wasserkühlanlage?</a></li>
                                                    <li><a href="artikel.html#ensotek-kuehltuerme">Eigenschaften der Ensotek Kühltürme</a></li>
                                                    <li><a href="artikel.html#kuehlturm-auswahl">Erforderliche Informationen für die Auswahl eines Kühlturms</a></li>
                                                    <li><a href="artikel.html#offener-kreislauf">Offener Kühlkreislaufturm Funktionsprinzip</a></li>
                                                    <li><a href="artikel.html#geschlossener-kreislauf">Funktionsprinzip des geschlossenen Kreislauf-Kühlturms</a></li>
                                                    <li><a href="artikel.html#feuchtkugeltemperatur-rechner">Feuchtkugeltemperatur Rechner</a></li>
                                                    <li><a href="artikel.html#feuchtkugeltemperatur-staedte">Feuchtkugeltemperatur in nach Städten</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="produkte.html" class="upper-level">Produkte</a>
                                                <ul>
                                                    <li><a href="produkte.html#offener-kreislauf">Kühlturm Mit Offenem Kreislauf</a></li>
                                                    <li><a href="produkte.html#geschlossener-kreislauf">Geschlossener Kreislaufkühlturm</a></li>
                                                    <li><a href="produkte.html#service-wartung">Service und Wartung</a></li>
                                                    <li><a href="produkte.html#mietkuehltuerme">Mietkühltürme</a></li>
                                                    <li><a href="produkte.html#verdunstungskondensator">Verdunstungskondensator</a></li>
                                                    <li><a href="produkte.html#wasseraufbereitung">Kühlturmwasseraufbereitung</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="materialien.html" class="upper-level">Turmmaterialien</a>
                                                <ul>
                                                    <li><a href="materialien.html#getriebe-luefter">Wasserkühlturmmotor Getriebe Lüfter</a></li>
                                                    <li><a href="materialien.html#axialventilator">Axialventilator (Lüfter) für Kühltürme</a></li>
                                                    <li><a href="materialien.html#vibrationsschalter">Vibrationsschalter</a></li>
                                                    <li><a href="materialien.html#drift-eliminator">Drift Eliminator</a></li>
                                                    <li><a href="materialien.html#wasserverteilungssystem">Wasserverteilungssystem</a></li>
                                                    <li><a href="materialien.html#kuehlturmdueese">Kühlturmdüse</a></li>
                                                    <li><a href="materialien.html#servicefenster">Servicefenster</a></li>
                                                    <li><a href="materialien.html#spritzgitter">Spritzgitter Kühlturmfüllung</a></li>
                                                    <li><a href="materialien.html#wasserkuehlturmpumpe">Wasserkühlturmpumpe</a></li>
                                                    <li><a href="materialien.html#plattenwaermetauscher">Plattenwärmetauscher</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <!-- Besucherangebote Menüsü -->
                        <li class="kuhlturm-dropdown">
                            <a href="hilfmittel.html" class="kuhlturm-nav-button" id="Hilfmittel">
                                <i class="fas fa-users"></i> Hilfmittel
                            </a>
                            <div class="kuhlturm-dropdown-content">
                                <div class="kuhlturm-dropdown-row">
                                    <!-- Infozentrum -->
                                    <div class="kuhlturm-dropdown-column hilfmittel-dropdown">
                                        <ul>
                                            <li><a href="hilfmittel.html#faq" class="upper-level">Hilfmittel</a>
                                                <ul>
                                                    <li><a href="hilfmittel.html#faq">FAQ</a></li>
                                                    <li><a href="hilfmittel.html#glossar">Glossar der Kühltechnologien</a></li>
                                                    <li><a href="hilfmittel.html#technische-artikel">Technische Artikel</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="reservierter-bereich.html" class="upper-level">Reservierter Bereich</a>
                                                <ul>
                                                    <li><a href="bewerbung.html">Bewerbung</a></li>
                                                    <li><a href="partnerschaft.html">Partnerschaft</a></li>
                                                    <li><a href="angebot.html">Ein Angebot bekommen</a></li>
                                                    <li><a href="kontakt.html#info">Nach Informationen fragen</a></li>
                                                </ul>
                                            </li>
                                             <li><a href="downloads.html" class="upper-level">Downloads</a>
                                                <ul>
                                                    <li><a href="downloads.html#broschueren">Broschüren</a></li>
                                                    <li><a href="downloads.html#bilddatenbank">Bilddatenbank</a></li>
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
  
    // FontAwesome İkonları dahil et
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
  