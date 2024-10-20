export function loadGalerie() {
    const galerieSection = document.getElementById('galerie');
    galerieSection.innerHTML = `
        <section id="Galerie">
            <h1>Galerie</h1>
            <h4>Diese Galerie wurde für unsere Geschäftspartner, Kunden und alle Besucher eingerichtet. Wir hoffen, dass Sie die Entwicklung, Kultur und den Beitrag von Ensotek zur Gesellschaft näher kennenlernen können.</h4>
            <div class="gallery-demo">
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

    const images = [
        "https://ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg",
        "https://ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg",
        "https://ensotek.com/upload/17/tctp-12c-aydin-orme.jpg",
        "https://ensotek.com/upload/17/aves-yag-tctp-9b.jpg",
        "https://ensotek.com/upload/17/aves-yag-tctp-9b-dctp-9b.jpg",
        "https://ensotek.com/upload/17/aves-yag-mersin-tctp-9b-2.jpg",
        "https://ensotek.com/upload/17/adacal-kucuk.jpg",
        "https://ensotek.com/upload/17/24.jpg",
        "https://ensotek.com/upload/17/zer-salca-tctp-20b.jpg",
        "https://ensotek.com/upload/17/ctp-9c.jpg"
    ];

    const $carouselImages = document.getElementById('carouselImages');
    const $carouselThumbnails = document.getElementById('carouselThumbnails');

    images.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.classList.add('carousel-image');
        imgElement.setAttribute('data-index', index);

        $carouselImages.appendChild(imgElement);

        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.classList.add('carousel-thumbnail');
        thumbnail.setAttribute('data-index', index);
        thumbnail.addEventListener('click', () => showSlide(index));

        $carouselThumbnails.appendChild(thumbnail);
    });

    let currentSlide = 0;
    let autoSlideInterval;

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

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 3000); // 3 saniyede bir otomatik geçiş
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    document.getElementById('prevBtn').addEventListener('click', () => {
        stopAutoSlide();
        showSlide(currentSlide - 1);
        startAutoSlide();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        stopAutoSlide();
        showSlide(currentSlide + 1);
        startAutoSlide();
    });

    // Başlangıçta ilk resmi göster ve otomatik slayt geçişi başlat
    showSlide(0);
    startAutoSlide();
}
