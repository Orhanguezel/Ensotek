export function loadReferenzen() {
    const referenzenSection = document.getElementById('Referenzen');
    referenzenSection.innerHTML = `
        <section id="Referenzen">
            <h1>Referenzen</h1>
            <h2>Wir sind stolz auf unsere Referenzen, die unsere Arbeit und unser Engagement für Qualität widerspiegeln. Unsere Projekte erstrecken sich über verschiedene Branchen, darunter Energie, Lebensmittel, Automobil, und viele mehr.</h2>
            <div class="refe">
                <div class="btn-group-vertical fixed-buttons">
                    <h4 class="fst-italic">Branche</h4>
                    <div class="btn-group w-100 m-1">
                        <button class="btn btn-primary" onclick="showImages('Allgemein')">Allgemeine Referenzen</button>
                        <button class="btn btn-primary" onclick="showImages('metall')">Metall</button>
                        <button class="btn btn-primary" onclick="showImages('kunst')">Kunststoff</button>
                        <button class="btn btn-primary" onclick="showImages('essen')">Lebensmittel-Öl</button>
                        <button class="btn btn-primary" onclick="showImages('zement')">Zement Bergbau</button>
                        <button class="btn btn-primary" onclick="showImages('tekstil')">Textil</button>
                        <button class="btn btn-primary" onclick="showImages('energie')">Energie</button>
                        <button class="btn btn-primary" onclick="showImages('chemie')">Chemische</button>
                        <button class="btn btn-primary" onclick="showImages('einkaufs')">Einkaufszentrum, Geschäftsgebäude, Hotel</button>
                        <button class="btn btn-primary" onclick="showImages('Automobil')">Automobil</button>
                        <button class="btn btn-primary" onclick="showImages('aliminum')">Aluminium, Drahtziehen</button>
                        <button class="btn btn-primary" onclick="showImages('verpact')">Verpackung, Papier, Isolierung</button>
                        <button class="btn btn-primary" onclick="showImages('maschinenbau')">Ingenieurwesen</button>
                    </div>
                </div>
                <div class="col-12" id="imageContainer">
                    <!-- Başlangıçta boş veya varsayılan içerikle -->
                </div>
            </div>
        </section>
    `;

    // Dinamik olarak görselleri gösterme fonksiyonu
    window.showImages = function (category) {
        const images = {
            Allgemein: [
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg",
                // Diğer genel referanslar
            ],
            metall: [
                "https://example.com/metall1.jpg",
                "https://example.com/metall2.jpg",
                // Diğer metal referansları
            ],
            // Diğer kategoriler için benzer diziler eklenebilir
        };

        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = ""; // Eski içeriği temizle

        // Seçilen kategoriye ait görselleri döngü ile ekle
        images[category].forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.classList.add('img-fluid');
            imageContainer.appendChild(imgElement);
        });
    }
}
