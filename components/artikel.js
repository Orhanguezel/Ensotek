import { articles } from './articles.js';

export function loadArtikel() {
    const articleTitles = document.getElementById('article-titles');
    const articleTitle = document.getElementById('article-title');
    const articleBody = document.getElementById('article-body');

    // Makale başlıklarını yükle
    articles.forEach((article, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `${index + 1}. ${article.title}`;
        link.addEventListener('click', () => {
            showArticle(article);
        });
        listItem.appendChild(link);
        articleTitles.appendChild(listItem);
    });

    // Varsayılan olarak ilk makaleyi göster
    if (articles.length > 0) {
        showArticle(articles[0]);
    }

    // Makale gösterim fonksiyonu
    function showArticle(article) {
        articleTitle.textContent = article.title;
        articleBody.innerHTML = article.content;
    }
}

// DOM yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', () => {
    loadArtikel();
});

