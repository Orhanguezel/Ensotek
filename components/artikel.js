export function loadArtikel() {
    const articles = [
        {
            title: "Was ist eine Wasserkühlanlage?",
            id: "Was-ist-eine-Wasserkühlanlage",
            content: `
            <h1>Was ist ein Kühlturm?</h1>
            <p>Ein Kühlturm für Wasser ist eine Wärmeeinheit...</p>
            `
        },
        {
            title: "Eigenschaften der Ensotek Kühltürme",
            id: "Eigenschaften-der-Ensotek-Kühltürme",
            content: `
            <h1>Eigenschaften der Ensotek Kühltürme</h1>
            <p>Unsere Kühltürme haben viele einzigartige Merkmale...</p>
            `
        }
    ];

    const articleTitles = document.getElementById('article-titles');
    const articleTitle = document.getElementById('article-title');
    const articleBody = document.getElementById('article-body');

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

    function showArticle(article) {
        articleTitle.textContent = article.title;
        articleBody.innerHTML = article.content;
    }
}

// Artikel component'i yükleyelim
document.addEventListener('DOMContentLoaded', () => {
    loadArtikel();
});
