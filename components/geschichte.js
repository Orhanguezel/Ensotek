export function loadGeschichte() {
    const geschichteSection = document.getElementById('geschichte');
    geschichteSection.innerHTML = `
        <section id="geschichte-section">
            <h1>Unsere Geschichte</h1>
            <div class="geschichte-container">
                <div class="geschichte-text">
                    <h4>Ensotek Su Soğutma Kuleleri A.Ş. hat eine tiefe Expertise und Innovationsgeschichte, die bis ins Jahr 1986 zurückreicht. Mit stetigem Wachstum und Innovationskraft hat Ensotek die Kühlturmindustrie nachhaltig geprägt und ist zu einem vertrauenswürdigen Partner für zahlreiche Industrien geworden.</h4>
                </div>
                <div class="geschichte-image">
                    <img src="img/all/cover_1.jpg" alt="Unsere Geschichte" class="img-fluid rounded"> <!-- Görsel -->
                </div>
            </div>
        </section>
    `;
}
