import { sectorImages } from "../data/referansImg.js"; // Resim veritabanını içe aktar

export function loadReferenzen() {
  const referenzenSection = document.getElementById("Referenzen");

  // Referans sayfasının dinamik içeriğini oluşturuyoruz
  referenzenSection.innerHTML = `
        <section id="Referenzen">
            <h1>Referenzen</h1>
            <h4>Wir sind stolz auf unsere Referenzen, die unsere Arbeit und unser Engagement für Qualität widerspiegeln. Unsere Projekte erstrecken sich über verschiedene Branchen, darunter Energie, Lebensmittel, Automobil, und viele mehr.</h4>
            <div class="refe">
                <div class="button-container">
                    <h3 class="category-heading">Branche</h3>
                    <div class="category-buttons">
                      <button class="custom-btn" onclick="showImages('Allgemein')">Allgemeine</button>
                      <button class="custom-btn" onclick="showImages('maschinenbau')">Ingenieurwesen</button>
                      <button class="custom-btn" onclick="showImages('Automobil')">Automobil</button>
                      <button class="custom-btn" onclick="showImages('energie')">Energie</button>
                      <button class="custom-btn" onclick="showImages('essen')">Lebensmittel-Öl</button>
                      <button class="custom-btn" onclick="showImages('kunst')">Kunststoff</button>
                      <button class="custom-btn" onclick="showImages('aliminum')">Aluminium, Drahtziehen</button>
                      <button class="custom-btn" onclick="showImages('verpact')">Verpackung, Papier, Isolierung</button>
                      <button class="custom-btn" onclick="showImages('metall')">Metall</button>
                      <button class="custom-btn" onclick="showImages('chemie')">Chemische</button>  
                      <button class="custom-btn" onclick="showImages('einkaufs')">Einkaufszentrum, Geschäftsgebäude, Hotel</button>
                      <button class="custom-btn" onclick="showImages('tekstil')">Textil</button>
                      <button class="custom-btn" onclick="showImages('zement')">Zement Bergbau</button>
                    </div>
                </div>
                <div class="image-grid" id="imageContainer">
                    <!-- Seçilen kategoriye ait görseller burada gösterilecek -->
                </div>
            </div>
        </section>
    `;

  // Görselleri gösterme fonksiyonu
  window.showImages = function (category) {
    const images = sectorImages[category] || []; // Seçilen kategoriye ait görseller
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = ""; // Eski içeriği temizle

    // Eğer seçilen kategoriye ait görseller varsa
    if (images.length) {
      images.forEach((imgData) => {
        const imgElement = document.createElement("img");
        imgElement.src = imgData.url;
        imgElement.alt = imgData.alt;
        imgElement.classList.add("custom-img");
        imageContainer.appendChild(imgElement);
      });
    } else {
      imageContainer.innerHTML = `<p>Bu kategoriye ait görsel bulunmamaktadır.</p>`;
    }
  };

  // Sayfa ilk yüklendiğinde varsayılan olarak "aliminum" kategorisi gösterilecek
  showImages("aliminum");
}

// Sayfa yüklendiğinde fonksiyonu çağır
document.addEventListener("DOMContentLoaded", function () {
  loadReferenzen();
});
