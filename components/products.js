// Dinamik olarak makale yükleme
const articles = [
    {
        title: "Kühlturm Mit Offenem Kreislauf",
        id: "Kühlturm-Mit-Offenem-Kreislauf",
        content: `
            <h1>Kühlturm Mit Offenem Kreislauf</h1>
            <h4>Die Ensotek-Kühltürme aus glasfaserverstärktem Polyester (FRP) sind die modernsten Kühltürme der neuesten Technologie unserer Zeit.</h4>
            <h4>Unsere Türme sind sehr langlebig und korrosionsbeständig.</h4>
            <!-- Diğer içerik buraya -->
        `
    },
    {
        title: "Geschlossener Kreislaufkühlturm",
        id: "Geschlossener-Kreislaufkühlturm",
        content: `
            <h1>Geschlossener Kreislaufkühlturm</h1>
            <h4>Geschlossene Systeme werden bei Prozessen bevorzugt, die sauberes Wasser benötigen.</h4>
            <!-- Diğer içerik buraya -->
        `
    },
    // Diğer ürünler buraya eklenecek...
];

// Dinamik olarak içerik yükleme
document.addEventListener('DOMContentLoaded', () => {
    const articleTitles = document.getElementById('article-titles');
    const articleTitle = document.getElementById('article-title');
    const articleContent = document.getElementById('article-content');

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
        articleContent.innerHTML = article.content;
    }
});
