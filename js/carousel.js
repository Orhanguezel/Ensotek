export function loadCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = `
        <div class='carousel-container'>
            <!-- Informasyon bölümü -->
            <div class='carousel-inf' id='carousel-inf'>
                <h2>Langlebige Designs, Kein Rostproblem.</h2>
                <p>Unsere Produkte sind langlebig und bestehen aus speziellen Materialien, die rostbeständig sind.</p>
            </div>
            
            <!-- Carousel bölümü -->
            <div class='owl-carousel' id='owlCarousel'>
                <div class='slide' data-title="Langlebige Designs, Kein Rostproblem." data-text="Unsere Produkte sind langlebig und bestehen aus speziellen Materialien, die rostbeständig sind.">
                    <img class='owl-item-bg' src='assets/img/slayt/1.png' alt='Bild 1'>
                </div>
                <div class='slide' data-title="Weltweit Anerkannt und die Wahl der Profis." data-text="Unsere Produkte, die weltweit Anerkennung finden, sind die erste Wahl der Profis.">
                    <img class='owl-item-bg' src='assets/img/slayt/2.png' alt='Bild 2'>
                </div>
                <div class='slide' data-title="Starke und Zuverlässige Produkte." data-text="Unsere Produkte sind stark und zuverlässig, geeignet für den langfristigen Einsatz.">
                    <img class='owl-item-bg' src='assets/img/slayt/3.png' alt='Bild 3'>
                </div>
                <div class='slide' data-title="Hohe Effizienz, Niedriger Energieverbrauch." data-text="Unsere Produkte bieten hohe Effizienz und sind umweltfreundlich mit niedrigem Energieverbrauch.">
                    <img class='owl-item-bg' src='assets/img/slayt/4.png' alt='Bild 4'>
                </div>
                <div class='slide' data-title="Benutzerfreundlich und Einfach zu Installieren." data-text="Unsere Produkte sind benutzerfreundlich und bieten einfache Installation und Wartung.">
                    <img class='owl-item-bg' src='assets/img/slayt/5.png' alt='Bild 5'>
                </div>
                <div class='slide' data-title="Umweltfreundlich und Nachhaltig." data-text="Unsere Produkte sind umweltfreundlich und aus nachhaltigen Materialien hergestellt.">
                    <img class='owl-item-bg' src='assets/img/slayt/6.png' alt='Bild 6'>
                </div>
                <div class='slide' data-title="Innovative Technologie und Überlegene Leistung." data-text="Unsere Produkte sind mit innovativer Technologie hergestellt und bieten überlegene Leistung.">
                    <img class='owl-item-bg' src='assets/img/slayt/7.png' alt='Bild 7'>
                </div>
                <div class='slide' data-title="Schnelle Lieferung und Hervorragender Kundenservice." data-text="Unsere Produkte werden schnell geliefert und bieten hervorragenden Kundenservice.">
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
        dots: false,  // Owl Carousel dots'u kapatıyoruz çünkü kendi radio butonlarımız var.
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1024: {
                items: 1
            }
        }
    });

    // Radio butonlarına tıklama ile slayt değişimi
    document.querySelectorAll('.radio-buttons input').forEach((radio, index) => {
        radio.addEventListener('click', () => {
            owlCarousel.trigger('to.owl.carousel', [index, 300]);
        });
    });

    // Slayt değiştikçe radio butonları güncellensin
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
