export function loadCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = `
        <div class='carousel-container'>
            <!-- Informasyon bölümü -->
            <div class='carousel-inf' id='carousel-inf'>
                <h2>Normalbetrieb</h2>
                <p>Mit Jahrgang 1984 ist das KKW Leibstadt das jüngste und leistungsstärkste Kernkraftwerk der Schweiz.</p>
            </div>
            
            <!-- Carousel bölümü -->
            <div class='owl-carousel' id='owlCarousel'>
                <div class='slide' data-title="Normalbetrieb" data-text="Mit Jahrgang 1984 ist das KKW Leibstadt das jüngste und leistungsstärkste Kernkraftwerk der Schweiz.">
                    <img class='owl-item-bg' src='assets/img/slayt/1.png' alt='Bild 1'>
                </div>
                <div class='slide' data-title="Sicherheit" data-text="Die Sicherheit unserer Anlagen hat höchste Priorität. Ständige Überwachung und Wartung garantieren einen sicheren Betrieb.">
                    <img class='owl-item-bg' src='assets/img/slayt/2.png' alt='Bild 2'>
                </div>
                <div class='slide' data-title="Effizienz" data-text="Unsere fortschrittlichen Technologien ermöglichen eine hohe Energieeffizienz und tragen zur Energieversorgung der Zukunft bei.">
                    <img class='owl-item-bg' src='assets/img/slayt/3.png' alt='Bild 3'>
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
