import { news } from "../data/news-data.js";

export function loadLatestNews() {
  const latestNewsHome = document.getElementById('latest-news-home-content');

  if (!latestNewsHome) {
    console.error("Latest news section could not be found");
    return;
  }

  // Haberleri tarihe göre sırala (en yeni en başta olacak şekilde)
  const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));

  // En güncel iki haberi al
  const latestTwoNews = sortedNews.slice(0, 2);

  // Metni sınırlama fonksiyonu
  function truncateText(text, limit) {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  // Her haberi eklemek için döngü
  latestNewsHome.innerHTML = latestTwoNews.map(latestNews => `
    <div class="news-card">
      <div class="news-date-bar">News | ${new Date(latestNews.date).toLocaleDateString('de-DE')}</div>
      <img src="${latestNews.image}" alt="${latestNews.title}" class="news-image-home">
      <div class="news-text-home">
        <h3>${latestNews.title}</h3>
        <p>${truncateText(latestNews.summary, 200)}</p>
        <a href="news.html?id=${latestNews.id}" class="read-more-link">Mehr erfahren <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  `).join("");
}

// Sayfa yüklendiğinde fonksiyonu çağır
document.addEventListener("DOMContentLoaded", function() {
  loadLatestNews();  // Ana sayfa için haberleri yükler
});
