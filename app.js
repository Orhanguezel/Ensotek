// app.js

import { loadHeader } from './components/header.js';
import { loadCarousel } from './components/carousel.js';
import { loadAktivit } from './components/aktivit.js';
import { loadUberUns } from './components/uberUns.js';
import { loadTeam } from './components/team.js';
import { loadVision } from './components/vision.js';
import { loadGeschichte } from './components/geschichte.js';
import { loadZertifikate } from './components/zertifikate.js'; // Yeni Zertifikate Component
import { loadReferenzen } from './components/referenzen.js';
import { loadGalerie } from './components/galerie.js'; // Yeni Galerie Component
import { loadKontakt } from './components/kontakt.js';
import { loadNews } from './components/news.js'; // Haberler için doğru olan
import { loadFooter } from './components/footer.js'; // Footer için doğru olan

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadCarousel();
    loadAktivit();
    loadUberUns();
    loadTeam();
    loadVision();
    loadGeschichte();
    loadZertifikate();
    loadReferenzen();
    loadGalerie(); // Yeni Galerie Component
    loadKontakt();
    loadFooter(); // Footer doğru tanımlama
    loadNews(); // Haberler doğru tanımlama
});
