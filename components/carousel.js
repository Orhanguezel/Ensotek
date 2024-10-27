export function loadCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = `
        <div class='carousel-container'>
            <!-- Informasyon bölümü -->
            <div class='carousel-inf' id='carousel-inf'>
                <h2>Robustes Design für Langlebigkeit</h2>
                <p>Unsere Produkte sind aus speziellen, rostfreien Materialien gefertigt und besonders langlebig.</p>
            </div>
            
            <!-- Carousel bölümü -->
            <div class='owl-carousel' id='owlCarousel'>
                <div class='slide' data-title="Robustes Design für Langlebigkeit" data-text="Unsere Produkte sind aus speziellen, rostfreien Materialien gefertigt und besonders langlebig.">
                    <img class='owl-item-bg' src='assets/img/slayt/1.png' alt='Bild 1'>
                </div>
                <div class='slide' data-title="Weltweit Anerkannt" data-text="Unsere Produkte werden weltweit geschätzt und sind die bevorzugte Wahl der Profis.">
                    <img class='owl-item-bg' src='assets/img/slayt/2.png' alt='Bild 2'>
                </div>
                <div class='slide' data-title="Stark und Zuverlässig" data-text="Langlebig und ideal für den dauerhaften Einsatz.">
                    <img class='owl-item-bg' src='assets/img/slayt/3.png' alt='Bild 3'>
                </div>
                <div class='slide' data-title="Effizient und Energiesparend" data-text="Unsere Produkte kombinieren hohe Effizienz mit geringem Energieverbrauch.">
                    <img class='owl-item-bg' src='assets/img/slayt/4.png' alt='Bild 4'>
                </div>
                <div class='slide' data-title="Einfache Installation" data-text="Unsere benutzerfreundlichen Produkte sind leicht zu installieren und zu warten.">
                    <img class='owl-item-bg' src='assets/img/slayt/5.png' alt='Bild 5'>
                </div>
                <div class='slide' data-title="Nachhaltig und Umweltfreundlich" data-text="Aus nachhaltigen Materialien gefertigt, schonen unsere Produkte die Umwelt.">
                    <img class='owl-item-bg' src='assets/img/slayt/6.png' alt='Bild 6'>
                </div>
                <div class='slide' data-title="Innovative Technologie" data-text="Mit modernster Technologie hergestellt, bieten unsere Produkte höchste Leistung.">
                    <img class='owl-item-bg' src='assets/img/slayt/7.png' alt='Bild 7'>
                </div>
                <div class='slide' data-title="Schnelle Lieferung & Kundenservice" data-text="Mit schneller Lieferung und exzellentem Kundenservice sind wir für Sie da.">
                    <img class='owl-item-bg' src='assets/img/slayt/8.png' alt='Bild 8'>
                </div>
            </div>

            <!-- Radyo butonları -->
            <div class="radio-buttons" id="radio-buttons">
                <input type="radio" id="radio1" name="slider" checked>
                <label for="radio1"></label>
                <input type="radio" id="radio2" name="slider">
                <label for="radio2"></label>
                <input type="radio" id="radio3" name="slider">
                <label for="radio3"></label>
                <input type="radio" id="radio4" name="slider">
                <label for="radio4"></label>
                <input type="radio" id="radio5" name="slider">
                <label for="radio5"></label>
                <input type="radio" id="radio6" name="slider">
                <label for="radio6"></label>
                <input type="radio" id="radio7" name="slider">
                <label for="radio7"></label>
                <input type="radio" id="radio8" name="slider">
                <label for="radio8"></label>
            </div>
        </div>
    `;

    const owlCarousel = $('#owlCarousel').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        nav: true,
        dots: false,
        responsive: {
            0: { items: 1 },
            768: { items: 1 },
            1024: { items: 1 }
        }
    });

    document.querySelectorAll('.radio-buttons input').forEach((radio, index) => {
        radio.addEventListener('click', () => {
            owlCarousel.trigger('to.owl.carousel', [index, 300]);
        });
    });

    owlCarousel.on('changed.owl.carousel', function(event) {
        const totalItems = event.item.count;
        let currentIndex = event.item.index - event.relatedTarget._clones.length / 2;
        currentIndex = (currentIndex < 0) ? totalItems - 1 : currentIndex % totalItems;

        document.querySelector(`#radio${currentIndex + 1}`).checked = true;

        const currentItem = $('#owlCarousel .slide').eq(currentIndex).data();
        if (currentItem) {
            const infoContainer = document.querySelector('#carousel-inf');
            infoContainer.classList.add('fade-out');

            setTimeout(() => {
                document.querySelector('#carousel-inf h2').textContent = currentItem.title;
                document.querySelector('#carousel-inf p').textContent = currentItem.text;
                infoContainer.classList.remove('fade-out');
            }, 500);
        }
    });
}
