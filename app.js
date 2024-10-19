import { loadHeader } from './components/header.js';
import { loadFooter } from './components/footer.js';
import { loadMainContent } from './components/mainContent.js';
import { loadCarousel } from './components/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadMainContent();
    loadCarousel();
});
