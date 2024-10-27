import { images } from "../data/galerie-data.js"; // data klasöründen resim listesini import ediyoruz

export function loadGalerie() {
    const galerieSection = document.getElementById('galerie');
    galerieSection.innerHTML = `
        <section id="Galerie">
            <div class="gallery-header">
                <h2><i class="fas fa-images"></i> Galerie</h1>
                <p>Diese Galerie wurde für unsere Geschäftspartner, Kunden und alle Besucher eingerichtet. Wir hoffen, dass Sie die Entwicklung, Kultur und den Beitrag von Ensotek zur Gesellschaft näher kennenlernen können.</p>
            </div>
            <div class="gallery-card">
                <div class="carousel-container">
                    <div class="carousel">
                        <div class="carousel-images" id="carouselImages">
                            <!-- Resimler buraya eklenecek -->
                        </div>
                        <button class="carousel-control prev" id="prevBtn">&#10094;</button>
                        <button class="carousel-control next" id="nextBtn">&#10095;</button>
                    </div>
                    <div class="carousel-thumbnails" id="carouselThumbnails">
                        <!-- Küçük resimler buraya eklenecek -->
                    </div>
                </div>
            </div>
        </section>
    `;

    const $carouselImages = document.getElementById('carouselImages');
    const $carouselThumbnails = document.getElementById('carouselThumbnails');

    images.forEach((image, index) => {
        // Büyük slayt için resim ekleme
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.classList.add('carousel-image');
        imgElement.setAttribute('data-index', index);
        $carouselImages.appendChild(imgElement);

        // Küçük resim ekleme
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.classList.add('carousel-thumbnail');
        thumbnail.setAttribute('data-index', index);
        thumbnail.addEventListener('click', () => showSlide(index));
        $carouselThumbnails.appendChild(thumbnail);
    });

    let currentSlide = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.carousel-image');
        const thumbnails = document.querySelectorAll('.carousel-thumbnail');
        const totalSlides = slides.length;

        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentSlide) {
                slide.classList.add('active');
            }
        });

        thumbnails.forEach((thumbnail, i) => {
            thumbnail.classList.remove('active');
            if (i === currentSlide) {
                thumbnail.classList.add('active');
            }
        });
    }

    // Başlangıçta ilk resmi göster
    showSlide(0);

    // İleri ve geri butonları için olay dinleyicileri
    document.getElementById('prevBtn').addEventListener('click', () => showSlide(currentSlide - 1));
    document.getElementById('nextBtn').addEventListener('click', () => showSlide(currentSlide + 1));
}
