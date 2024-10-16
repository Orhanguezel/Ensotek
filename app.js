import { loadHeader } from './components/header.js';
import { loadFooter } from './components/footer.js';

// Header ve Footer'ı yükleyelim
window.onload = function() {
    loadHeader();
    loadFooter();
};
