export function loadGeschichte() {
    const geschichteSection = document.getElementById('geschichte');
    geschichteSection.innerHTML = `
        <section id="geschichte-section">
            <div class="geschichte-container">
                <div class="geschichte-card">
                    <div class="geschichte-text">
                        <h2><i class="fas fa-history"></i> Unsere Geschichte</h3>
                        <p>Ensotek Kühltürme GMBH hat eine tiefe Expertise und Innovationsgeschichte, die bis ins Jahr 1986 zurückreicht. Mit stetigem Wachstum und Innovationskraft hat Ensotek die Kühlturmindustrie nachhaltig geprägt und ist zu einem vertrauenswürdigen Partner für zahlreiche Industrien geworden.</p>
                    </div>
                    <div class="geschichte-image">
                        <img src="assets/img/all/cover_1.jpg" alt="Unsere Geschichte" class="img-fluid rounded">
                    </div>
                </div>
            </div>
        </section>
    `;
}
