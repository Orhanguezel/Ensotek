export function loadVision() {
    const visionSection = document.getElementById('vision');
    visionSection.innerHTML = `
        <section id="vision-mission">
            <div class="vision-container">
                <div class="mission-vision-item">
                    <i class="fas fa-bullseye icon" aria-hidden="true"></i>
                    <div>
                        <h2>Mission</h2>
                        <p>Indem wir stets die neuesten Innovationen im Bereich der Wasserkühlungstechnologie verfolgen, möchten wir unseren Kunden die bestmöglichen Lösungen anbieten. Unser Ziel ist es, mit hoher Qualität und Nachhaltigkeit langfristige Partnerschaften aufzubauen.</p>
                    </div>
                </div>
                <div class="mission-vision-item">
                    <i class="fas fa-lightbulb icon" aria-hidden="true"></i>
                    <div>
                        <h2>Vision</h2>
                        <p>Wir streben danach, unseren Kunden effiziente, kostengünstige und langlebige Wasserkühltürme anzubieten, die den Anforderungen der heutigen Industrie entsprechen. Mit kontinuierlicher Innovation wollen wir führend in der Branche bleiben.</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}

