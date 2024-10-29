// app.js

import { loadHeader } from '../components/header.js';
import { loadCarousel } from '../components/carousel.js';
import { loadAktivit } from '../components/aktivit.js';
import { loadLatestNews } from '../components/news-data.js';
import { loadUberUns } from '../components/uberUns.js';
import { loadVision } from '../components/vision.js';
import { loadGeschichte } from '../components/geschichte.js';import { loadZertifikate } from '../components/zertifikate.js'; // Yeni Zertifikate Component
import { loadGalerie } from '../components/galerie.js'; // Yeni Galerie Component
import { loadKontakt } from '../components/kontakt.js';
import { loadFooter } from '../components/footer.js'; // Footer için doğru olan

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadCarousel();
    loadAktivit();
    loadLatestNews();
    loadUberUns();
    loadVision();
    loadGeschichte();
    loadGalerie(); // Yeni Galerie Component
    loadKontakt();
    loadFooter(); // Footer doğru tanımlama
});
