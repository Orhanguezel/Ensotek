export function loadAktivit() {
  const aktivitSection = document.getElementById("Aktivit");
  aktivitSection.innerHTML = `
    <section id="Aktivit">
      <h1><i class="fas fa-tasks"></i> Unsere Aktivitäten</h1>
      <h2>Ensotek bietet eine breite Palette von Aktivitäten im Bereich industrieller Wasser-Kühltürme und zugehöriger Dienstleistungen.</h2>
      <div class="akt">
        <input type="radio" id="tab1" name="tab-control" checked>
        <input type="radio" id="tab2" name="tab-control">
        <input type="radio" id="tab3" name="tab-control">
        <input type="radio" id="tab4" name="tab-control">
        <input type="radio" id="tab5" name="tab-control">
        <input type="radio" id="tab6" name="tab-control">
        <ul class="akt-tabs">
          <li title="Produktion">
            <label for="tab1" role="button">
              <i class="fas fa-industry"></i><br><span>Produzieren</span>
            </label>
          </li>
          <li title="Instandhaltung und Reparatur">
            <label for="tab2" role="button">
              <i class="fas fa-tools"></i><br><span>Instandhaltung & Reparatur</span>
            </label>
          </li>
          <li title="Modernisierung">
            <label for="tab3" role="button">
              <i class="fas fa-sync-alt"></i><br><span>Modernisierung</span>
            </label>
          </li>
          <li title="Ersatzteile und Komponenten">
            <label for="tab4" role="button">
              <i class="fas fa-cogs"></i><br><span>Ersatzteile & Komponenten</span>
            </label>
          </li>
          <li title="Anwendungen und Referenzen">
            <label for="tab5" role="button">
              <i class="fas fa-project-diagram"></i><br><span>Anwendungen & Referenzen</span>
            </label>
          </li>
          <li title="Ingenieurunterstützung">
            <label for="tab6" role="button">
              <i class="fas fa-user-cog"></i><br><span>Ingenieurunterstützung</span>
            </label>
          </li>
        </ul>

        <div class="content">
          <section class="content-section active">
            <h2><i class="fas fa-industry"></i> Produktion</h2>
            <div class="image-text-wrapper">
              <img src="assets/img/aktiv/prod.jpg" alt="Produktion" class="img">
              <h4>Ensotek ist auf die Herstellung industrieller Wasser-Kühltürme spezialisiert. Unser Produktionsprozess umfasst die Herstellung von offenen und geschlossenen Kühltürmen aus FRP (Glasfaserverstärktem Polyester).</h4>
            </div>
          </section>

          <section class="content-section">
            <h2><i class="fas fa-tools"></i> Instandhaltung & Reparatur</h2>
            <div class="image-text-wrapper">
              <img src="assets/img/aktiv/reparature.jpg" alt="Instandhaltung & Reparatur" class="img">
              <h4>Wir bieten regelmäßige Wartungs- und Reparaturdienste an, um die Effizienz vorhandener Kühltürme zu gewährleisten.</h4>
            </div>
          </section>

          <section class="content-section">
            <h2><i class="fas fa-sync-alt"></i> Modernisierung</h2>
            <div class="image-text-wrapper">
              <img src="assets/img/aktiv/modern.jpg" alt="Modernisierung" class="img">
              <h4>Ensotek bietet Dienstleistungen zur Modernisierung alter Kühltürme an, um deren Leistung zu verbessern.</h4>
            </div>
          </section>

          <section class="content-section">
            <h2><i class="fas fa-cogs"></i> Ersatzteile & Komponenten</h2>
            <div class="image-text-wrapper">
              <img src="assets/img/aktiv/komponent.jpg" alt="Ersatzteile & Komponenten" class="img">
              <h4>Wir bieten ein breites Sortiment an Ersatzteilen und Komponenten, um den reibungslosen Betrieb von Kühltürmen sicherzustellen.</h4>
            </div>
          </section>

          <section class="content-section">
            <h2><i class="fas fa-project-diagram"></i> Anwendungen & Referenzen</h2>
            <div class="image-text-wrapper">
              <img src="assets/img/all/uber.jpg" alt="Anwendungen & Referenzen" class="img">
              <h4>Ensotek verfügt über eine umfangreiche Referenzliste in verschiedenen industriellen und kommerziellen Anwendungsbereichen.</h4>
            </div>
          </section>

          <section class="content-section">
            <h2><i class="fas fa-user-cog"></i> Ingenieurunterstützung</h2>
            <div class="image-text-wrapper">
              <img src="assets/img/all/ingenieur.jpg" alt="Ingenieurunterstützung" class="img">
              <h4>Unser Ingenieurteam bietet spezialisierte Unterstützung, um sicherzustellen, dass Kühltürme effizient arbeiten.</h4>
            </div>
          </section>
        </div>
      </div>
    </section>
  `;

  const tabs = document.querySelectorAll('input[name="tab-control"]');
  const sections = document.querySelectorAll('.content-section');

  // İlk sekmenin açılışta görünmesi
  sections[0].classList.add('active');

  // Kartların tıklanarak gösterilmesini sağlar
  tabs.forEach((tab, index) => {
    tab.addEventListener('change', () => {
      sections.forEach((section, sectionIndex) => {
        if (index === sectionIndex) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });
}
