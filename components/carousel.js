export function loadCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = `
        <div class='carousel-container'>
            <!-- Informasyon bölümü -->
            <div class='carousel-info' id='carousel-info'>
                <h2>Normalbetrieb</h2>
                <p>Mit Jahrgang 1984 ist das KKW Leibstadt das jüngste und leistungsstärkste Kernkraftwerk der Schweiz.</p>
            </div>
            
            <!-- Carousel bölümü -->
            <div class='owl-carousel' id='owlCarousel'>
                <div class='slide' data-title="Normalbetrieb" data-text="Mit Jahrgang 1984 ist das KKW Leibstadt das jüngste und leistungsstärkste Kernkraftwerk der Schweiz.">
                    <img class='owl-item-bg' src='img/slayt/1.png' alt='Bild 1'>
                </div>
                <div class='slide' data-title="Sicherheit" data-text="Die Sicherheit unserer Anlagen hat höchste Priorität. Ständige Überwachung und Wartung garantieren einen sicheren Betrieb.">
                    <img class='owl-item-bg' src='img/slayt/2.png' alt='Bild 2'>
                </div>
                <div class='slide' data-title="Effizienz" data-text="Unsere fortschrittlichen Technologien ermöglichen eine hohe Energieeffizienz und tragen zur Energieversorgung der Zukunft bei.">
                    <img class='owl-item-bg' src='img/slayt/3.png' alt='Bild 3'>
                </div>
            </div>
        </div>
    `;

    jQuery(function () {
        const owlCarousel = $('#owlCarousel').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            nav: true,
            dots: true,
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

        owlCarousel.on('changed.owl.carousel', function(event) {
            const totalItems = event.item.count;
            let currentIndex = event.item.index - event.relatedTarget._clones.length / 2;
            currentIndex = (currentIndex < 0) ? totalItems - 1 : currentIndex % totalItems;

            const items = $('#owlCarousel .slide');
            const currentItem = items.eq(currentIndex).data();

            if (currentItem) {
                const infoContainer = document.querySelector('#carousel-info');
                infoContainer.classList.add('fade-out');

                setTimeout(() => {
                    document.querySelector('#carousel-info h2').textContent = currentItem.title;
                    document.querySelector('#carousel-info p').textContent = currentItem.text;
                    infoContainer.classList.remove('fade-out');
                }, 500);
            }
        });

        const initialItem = $('#owlCarousel .slide').eq(0).data();
        if (initialItem) {
            document.querySelector('#carousel-info h2').textContent = initialItem.title;
            document.querySelector('#carousel-info p').textContent = initialItem.text;
        }
    });
}
