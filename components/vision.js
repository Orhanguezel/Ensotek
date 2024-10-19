export function loadVision() {
    const visionSection = document.getElementById('vision');
    visionSection.innerHTML = `
        <section id="vision-mission">
            <h1>Vision und Mission</h1>
            <h2>Unsere Vision und Mission definieren, wer wir sind und wohin wir streben.</h2>
            <div class="vision-container">
                <div class="vision-text">
                    <h3>• Unsere Mission</h3>
                    <h4>Indem wir stets die neuesten Innovationen im Bereich der Wasserkühlungstechnologie verfolgen...</h4>
                    <h3>• Unsere Vision</h3>
                    <h4>Wir streben danach, unseren Kunden effiziente, kostengünstige und langlebige Wasserkühltürme anzubieten...</h4>
                </div>
                <div class="vision-image">
                    <img src="img/all/uber.jpg" alt="Team" class="img-fluid rounded"> <!-- Görsel -->
                </div>
            </div>
        </section>
    `;
}
