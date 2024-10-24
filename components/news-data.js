import { news } from "../data/news-data.js";

export function loadLatestNews() {
  const latestNewsHome = document.getElementById('latest-news-home-content');
  
  if (!latestNewsHome) {
    console.error("Latest news section could not be found");
    return;
  }
  
  // Haberleri tarihe göre sırala (en yeni en başta olacak şekilde)
  const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // En son haberi al
  const latestNews = sortedNews[0];
  
  // Haberi HTML olarak ekle
  latestNewsHome.innerHTML = `
    <h3>${latestNews.title}</h3>
    <p>${latestNews.summary}</p>
    <img src="${latestNews.image}" alt="${latestNews.title}" class="news-image-home">
  `;
}

// Sayfa yüklendiğinde fonksiyonu çağır
document.addEventListener("DOMContentLoaded", function() {
  loadLatestNews();  // Ana sayfa için son haberi yükler
});
