import { articles } from '../data/materialien-data.js'; // data klasöründeki articles verilerini al

document.addEventListener('DOMContentLoaded', () => {
    const articleTitles = document.getElementById('article-titles');
    const articleTitle = document.getElementById('article-title');
    const articleContent = document.getElementById('article-body');
    const productGallery = document.getElementById('product-gallery');
    const backButtonTop = document.getElementById('back-button-top');
    const backButtonBottom = document.getElementById('back-button-bottom');
    
    // Ana sayfayı göster
    function showMainPage() {
        articleTitle.innerHTML = '<i class="fas fa-info-circle"></i> Wählen Sie ein Material aus dem Menü, um mehr zu erfahren.';
        articleContent.innerHTML = '';
        productGallery.style.display = 'flex';
        backButtonTop.classList.add('hidden');
        backButtonBottom.classList.add('hidden');
    }
    
    // Fonksiyonu dışarıya aç
    window.showMainPage = showMainPage;
    
    // Materyal başlıklarını sol menüye ve galeriye ekle
    articles.forEach((article, index) => {
        // Sol menüdeki başlıklar
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `${index + 1}. ${article.title}`;
        link.addEventListener('click', () => {
            showArticle(article); // Başlığa tıklanınca ilgili materyalin içeriğini göster
        });
        listItem.appendChild(link);
        articleTitles.appendChild(listItem);
        
        // Ürün Galerisi Resimleri
        article.content.match(/<img[^>]+src="([^">]+)"/g).forEach((imgTag, imgIndex) => {
            const imageSrc = imgTag.match(/src="([^">]+)"/)[1];
            const imageAlt = article.content.match(/alt="([^">]+)"/g)[imgIndex].match(/alt="([^">]+)"/)[1];

            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const image = document.createElement('img');
            image.src = imageSrc;
            image.alt = imageAlt;

            const caption = document.createElement('p');
            caption.textContent = article.title;

            image.addEventListener('click', () => {
                showArticle(article); // Resme tıklayınca ilgili materyalin içeriğini göster
            });

            productDiv.appendChild(image);
            productDiv.appendChild(caption);
            productGallery.appendChild(productDiv);
        });
    });

    // Materyalin içeriğini dinamik olarak göster
    function showArticle(article) {
        articleTitle.textContent = article.title;
        articleContent.innerHTML = article.content;
        productGallery.style.display = 'none';
        backButtonTop.classList.remove('hidden'); // Zurück düğmesini göster
        backButtonBottom.classList.remove('hidden'); // Zurück düğmesini göster
    }
    
    // Ana sayfa ilk açılışta görünsün
    showMainPage();
});
