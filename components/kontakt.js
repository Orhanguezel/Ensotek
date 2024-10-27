export function loadKontakt() {
    const kontaktSection = document.getElementById("kontakt");
    kontaktSection.innerHTML = `
        <section class="Kontakt" id="Kontakt">
            <div class="contact-container">
                <div class="contact-section">
                    <div class="contact-card">
                        <i class="fas fa-map-marker-alt icon"></i>
                        <div class="contact-text">
                            <h4>Hauptadresse:</h4>
                            <p>Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41<br> 
                            34235 Esenler/ISTANBUL - TÜRKEI<br> 
                            Telefon:<br>
                            +90 212 613 33 09 <br>
                            +90 531 880 31 51 <br>
                            +90 531 880 32 15</p>
                        </div>
                    </div>
                    <div class="map-card">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30087.51162522182!2d28.913109103322386!3d41.03833918686434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac8f2c1de2e15%3A0xe7e1c9f7fb9e92f7!2sENSOTEK%20CTP%20Su%20So%C4%9Futma%20Kuleleri%20ve%20Teknolojileri%20M%C3%BChendislik%20San.Tic.%20Ltd.%20%C5%9Eti!5e0!3m2!1str!2str!4v1648764267997" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="contact-section">
                    <div class="contact-card">
                        <i class="fas fa-map-marker-alt icon"></i>
                        <div class="contact-text">
                            <h4>Fabrikadresse:</h4>
                            <p>Saray Mah. Gimat Cad. No:6A<br> 
                            06980 Kahramankazan/ANKARA - TÜRKEI<br> 
                            Telefon:<br>
                            +90 312 802 02 92 <br>
                            +90 531 880 32 15</p>
                        </div>
                    </div>
                    <div class="map-card">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.442336792944!2d32.55559681543859!3d39.8147959794267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e78a6c803f8c91%3A0xc0240123f08fa485!2sEnsotek%20Su%20So%C4%9Futma%20Kuleleri!5e0!3m2!1str!2str!4v1649782942337!5m2!1str!2str" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </section>
    `;
}
