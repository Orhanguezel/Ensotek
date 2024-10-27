import { images } from "../data/galerie-data.js"; // data klasöründen resim listesini import ediyoruz

export function loadGalerie() {
    const galerieSection = document.getElementById('galerie');
    galerieSection.innerHTML = `
        <!-- Galeri bileşeni -->
        <section id="Galerie">
            <div class="gallery-header">
                <h2><i class="fas fa-images"></i> Galerie</h2>
                <p>Diese Galerie wurde für unsere Geschäftspartner, Kunden und alle Besucher eingerichtet. Wir hoffen, dass Sie die Entwicklung, Kultur und den Beitrag von Ensotek zur Gesellschaft näher kennenlernen können.</p>
            </div>
            <div class="gallery-card">
                <div class="gallery-carousel-container">
                    <div class="gallery-carousel">
                        <div class="gallery-carousel-images" id="galleryCarouselImages">
                            <!-- Resimler buraya eklenecek -->
                        </div>
                        <button class="gallery-carousel-control gallery-prev" id="galleryPrevBtn">&#10094;</button>
                        <button class="gallery-carousel-control gallery-next" id="galleryNextBtn">&#10095;</button>
                    </div>
                    <div class="gallery-carousel-thumbnails" id="galleryCarouselThumbnails">
                        <!-- Küçük resimler buraya eklenecek -->
                    </div>
                </div>
            </div>
        </section>
    `;

    const $carouselImages = document.getElementById('galleryCarouselImages');
    const $carouselThumbnails = document.getElementById('galleryCarouselThumbnails');

    images.forEach((image, index) => {
        // Büyük slayt için resim ekleme
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.classList.add('gallery-carousel-image');
        imgElement.setAttribute('data-index', index);
        $carouselImages.appendChild(imgElement);

        // Küçük resim ekleme
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.classList.add('gallery-carousel-thumbnail');
        thumbnail.setAttribute('data-index', index);
        thumbnail.addEventListener('click', () => showSlide(index));
        $carouselThumbnails.appendChild(thumbnail);
    });

    let currentSlide = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.gallery-carousel-image');
        const thumbnails = document.querySelectorAll('.gallery-carousel-thumbnail');
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
    document.getElementById('galleryPrevBtn').addEventListener('click', () => showSlide(currentSlide - 1));
    document.getElementById('galleryNextBtn').addEventListener('click', () => showSlide(currentSlide + 1));
}
