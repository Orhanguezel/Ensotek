export function loadGalerie() {
    const galerieSection = document.getElementById('galerie');
    galerieSection.innerHTML = `
        <section id="Galerie">
            <h1>Galerie</h1>
            <h4>Diese Galerie wurde für unsere Geschäftspartner, Kunden und alle Besucher eingerichtet. Wir hoffen, dass Sie die Entwicklung, Kultur und den Beitrag von Ensotek zur Gesellschaft näher kennenlernen können.</h4>
            <div class="gallery-demo">
                <ul id="lightSlider"></ul> <!-- JavaScript ile dinamik olarak doldurulacak -->
            </div>
        </section>
    `;

    // JavaScript kodu dinamik olarak resimleri ekler ve LightSlider'ı başlatır
    $(document).ready(function () {
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
            // Daha fazla resim buraya eklenebilir
        ];

        const $lightSlider = $('#lightSlider');
        images.forEach((image) => {
            $lightSlider.append(`<li data-thumb="${image}"><img src="${image}" class="lightslider" /></li>`);
        });

        $lightSlider.lightSlider({
            gallery: true,
            item: 1,
            loop: true,
            slideMargin: 0,
            thumbItem: 9,
            adaptiveHeight: true,
            thumbMargin: 0,
            onSliderLoad: function (el) {
                el.lightGallery({
                    selector: '#lightSlider .lslide'
                });
            }
        });
    });
}
