export function loadKontakt() {
    const kontaktSection = document.getElementById('kontakt');
    kontaktSection.innerHTML = `
        <section class="Kontakt" id="Kontakt">
            <h1>Kontaktieren Sie uns</h1>
            <div class="logo">
                <div class="logo3">
                    <img src="img/LOGO2/7.png" alt="logo">
                </div>
            </div>
            <h2>Sie können uns jederzeit kontaktieren. Wir sind für Sie da.</h2>
            <div class="grid-container">
                <div class="grid-item border">
                    <div class="contact-icon text-center">
                        <div class="single-icon">
                            <i class="fas fa-map-marker-alt"></i>
                            <h5>Hauptadresse:<br>
                                Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41<br>
                                34235 Esenler/ISTANBUL - TÜRKEI<br>
                                Telefon:<br>
                                +90 212 613 33 09<br>
                                +90 531 880 31 51<br>
                                +90 531 880 32 15
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="grid-item border">
                    <div class="contact-icon text-center">
                        <div class="single-icon">
                            <i class="fas fa-map-marker-alt"></i>
                            <h5>Fabrikadresse:<br>
                                Saray Mah. Gimat Cad. No:6A<br>
                                06980 Kahramankazan/ANKARA - TÜRKEI<br>
                                Telefon:<br>
                                +90 312 802 02 92<br>
                                +90 531 880 32 15
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="grid-item border" id="message-item">
                    <div class="contact-icon text-start">
                        <div class="single-icon">
                            <i class="fas fa-envelope"></i>
                            <h6>Sehr geehrte Kundin und Kunde,<br>
                                um ein Angebot für eine Kühlturm-Lösung zu erhalten und mehr über unsere maßgeschneiderten Lösungen für Ihr Unternehmen zu erfahren, füllen Sie bitte das folgende Anfrageformular aus. Unser professionelles Team wird sich so schnell wie möglich bei Ihnen melden und Ihnen die besten Preise für unsere Lösungen anbieten.<br>
                                Vielen Dank.
                            </h6>
                        </div>
                    </div>
                </div>
                <div class="grid-item border">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30087.51162522182!2d28.913109103322386!3d41.03833918686434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac8f2c1de2e15%3A0xe7e1c9f7fb9e92f7!2sENSOTEK%20CTP%20Su%20So%C4%9Futma%20Kuleleri%20ve%20Teknolojileri%20M%C3%BChendislik%20San.Tic.%20Ltd.%20%C5%9Eti!5e0!3m2!1str!2str!4v1648764267997" width="100%" height="380" frameborder="0" style="border:0" allowfullscreen></iframe>
                </div>
                <div class="grid-item border">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.442336792944!2d32.55559681543859!3d39.8147959794267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e78a6c803f8c91%3A0xc0240123f08fa485!2sEnsotek%20Su%20So%C4%9Futma%20Kuleleri!5e0!3m2!1str!2str!4v1649782942337!5m2!1str!2str" width="100%" height="380" frameborder="0" style="border:0" allowfullscreen></iframe>
                </div>
                <div class="grid-item border" id="form-item">
                    <div class="form contact-form">
                        <form action="forms/contact.php" method="post" role="form" class="php-email-form">
                            <div class="form-group">
                                <input type="text" name="name" class="form-control" id="name" placeholder="Ihr Name" required>
                            </div>
                            <div class="form-group mt-3">
                                <input type="email" class="form-control" name="email" id="email" placeholder="Ihre E-Mail" required>
                            </div>
                            <div class="form-group mt-3">
                                <input type="text" class="form-control" name="subject" id="subject" placeholder="Betreff" required>
                            </div>
                            <div class="form-group mt-3">
                                <textarea class="form-control" name="message" rows="5" placeholder="Nachricht" required></textarea>
                            </div>
                            <div class="my-3">
                                <div class="loading">Wird geladen</div>
                                <div class="error-message"></div>
                                <div class="sent-message">Ihre Nachricht wurde gesendet. Vielen Dank!</div>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" type="submit">Nachricht senden</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
}
