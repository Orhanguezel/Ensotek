export function loadHeader() {
    const header = document.getElementById("header");
    header.innerHTML = `
          <header>
  <div class="kuhlturm-header-top">
    <img src="logo.png" alt="KKL Logo" class="kuhlturm-logo">
    <div class="kuhlturm-top-links">
      <a href="#">Newsletter</a> | 
      <a href="#">Sitemap</a> | 
      <a href="#">RSS-Feed</a> | 
      <a href="#">Fremdfirmen</a> | 
      <a href="#">Login</a> | 
      <a href="#">Suche</a>
    </div>
    <div class="kuhlturm-mobile-menu-button" id="menu-toggle">&#9776;</div>
  </div>

  <nav class="kuhlturm-main-nav" id="main-nav">
    <ul>
        <!-- Unternehmen Menüsü -->
        <li class="kuhlturm-dropdown">
            <a href="#" class="kuhlturm-nav-button" id="Unternehmen">
                <img src="path_to_icon/icon-unternehmen.png" alt="Unternehmen"> Unternehmen
            </a>
            <div class="kuhlturm-dropdown-content kuhlturm-show">
                <div class="kuhlturm-dropdown-row">
                    <!-- Leitbild und Geschäftsprinzipien -->
                    <div class="kuhlturm-dropdown-column">
                        <ul>
                            <li><a href="#" class="upper-level" >Leitbild und Geschäftsprinzipien</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                            <li><a href="#" class="upper-level">Organisation</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                             <li><a href="#" class="upper-level" >Leitbild und Geschäftsprinzipien</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                            <li><a href="#" class="upper-level">Organisation</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>

        <!-- Kernenergie Menüsü -->
        <li class="kuhlturm-dropdown">
            <a href="#" class="kuhlturm-nav-button" id="Kernenergie">
                <img src="path_to_icon/icon-kernenergie.png" alt="Kernenergie"> Kernenergie
            </a>
            <div class="kuhlturm-dropdown-content kuhlturm-show">
                <div class="kuhlturm-dropdown-row">
                    <!-- Stromproduktion -->
                    <div class="kuhlturm-dropdown-column">
                        <ul>
                            <li><a href="#" class="upper-level">Stromproduktion</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                            <li><a href="#"class="upper-level">Funktion des Kernkraftwerks</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>

        <!-- Besucherangebote Menüsü -->
        <li class="kuhlturm-dropdown">
            <a href="#" class="kuhlturm-nav-button" id="Besucherangebote">
                <img src="path_to_icon/icon-besucherangebote.png" alt="Besucherangebote"> Besucherangebote
            </a>
            <div class="kuhlturm-dropdown-content kuhlturm-show">
                <div class="kuhlturm-dropdown-row">
                    <!-- Infozentrum -->
                    <div class="kuhlturm-dropdown-column">
                        <ul>
                            <li><a href="#"class="upper-level">Infozentrum</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                            <li><a href="#"class="upper-level">Seminarräume</a>
                                <ul>
                                    <li><a href="#">Alt Link 1</a></li>
                                    <li><a href="#">Alt Link 2</a></li>
                                    <li><a href="#">Alt Link 3</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</nav>


</header>

      `;
  
    // Dropdown menü açma/kapama
    const dropdowns = document.querySelectorAll(".kuhlturm-dropdown");
  
    dropdowns.forEach((dropdown) => {
      const button = dropdown.querySelector(".kuhlturm-nav-button");
      const content = dropdown.querySelector(".kuhlturm-dropdown-content");
  
      button.addEventListener("click", (event) => {
        event.preventDefault();
        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown
              .querySelector(".kuhlturm-dropdown-content")
              .classList.remove("kuhlturm-show");
          }
        });
        content.classList.toggle("kuhlturm-show");
      });
    });
  
    // Mobil menü açma/kapatma
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
  
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("kuhlturm-mobile-visible");
    });
  }
  