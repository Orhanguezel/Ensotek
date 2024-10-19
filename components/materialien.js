export function loadMaterialien() {
    const materials = [
        {
            title: "Wasserkühlturmmotor - Getriebe - Lüfter",
            id: "Wasserkühlturmmotor",
            image: "img/material/motor-reduktor-fan-grubu-250x400-1.jpg",
            description: "An der Spitze des Turms arbeitet der Elektromotor mit Ventilator..."
        },
        {
            title: "Kühlturm-Axialventilator",
            id: "Axialventilator",
            image: "img/material/fan-250x400-1.jpg",
            description: "Kühlturm-Axialventilator sorgt für effiziente Kühlung."
        },
        // Diğer materyaller bu şekilde eklenebilir...
    ];

    const articleTitles = document.getElementById('article-titles');
    const articleTitle = document.getElementById('article-title');
    const articleContent = document.querySelector('.text');
    const productImages = document.querySelector('.product-images');

    materials.forEach((material, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `${index + 1}. ${material.title}`;
        link.addEventListener('click', () => {
            showMaterial(material);
        });
        listItem.appendChild(link);
        articleTitles.appendChild(listItem);
    });

    function showMaterial(material) {
        articleTitle.textContent = material.title;
        articleContent.innerHTML = `<p>${material.description}</p>`;
        productImages.innerHTML = `
            <div class="product-item">
                <img src="${material.image}" alt="${material.title}">
                <p>${material.title}</p>
            </div>
        `;
    }
}

// Materialien component'i yükleyelim
document.addEventListener('DOMContentLoaded', () => {
    loadMaterialien();
});
