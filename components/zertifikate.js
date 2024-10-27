export function loadZertifikate() {
    const zertifikateSection = document.getElementById('zertifikate');
    zertifikateSection.innerHTML = `
        <section id="zertifikate-section">
            <h1>Zertifikate</h1>
            <h4>Ensotek bestätigt seine Branchenführung und Qualität durch eine Reihe international anerkannter Zertifikate, die unsere Standards für Umwelt, Arbeitssicherheit und Qualität gewährleisten.</h4>
            <h4>Die Zertifikate ISO 9001:2015, ISO 14001:2015 und ISO 45001:2018, die wir bei Ensotek halten, sind ein Beweis für unser Engagement für höchste Standards.</h4>
            <div class="container-zertifikate">
                <img src="assets/img/zertifika/14001_1.jpg" alt="ISO 14001 Zertifikat">
                <img src="assets/img/zertifika/45001_1.jpg" alt="ISO 45001 Zertifikat">
                <img src="assets/img/zertifika/ce-belgesi-ce-declaration.jpg" alt="CE Zertifikat">
                <img src="assets/img/zertifika/eac-ensotek.jpg" alt="EAC Zertifikat">
                <img src="assets/img/zertifika/iso-10002.jpg" alt="ISO 10002 Zertifikat">
                <img src="assets/img/zertifika/iso-9001.jpg" alt="ISO 9001 Zertifikat">
            </div>
        </section>
    `;
}

// Sayfa yüklendiğinde fonksiyonu çağır
document.addEventListener("DOMContentLoaded", function() {
  loadZertifikate();
});

