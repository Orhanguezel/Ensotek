
      import { news } from "../data/news-data.js";

      // Sayfada kaç haber gösterileceğini belirleyen değişken
      let appCurrentIndex = 0;
      const maxNewsToShow = 2; // Sol tarafta kaç haber gösterilecek (şu an 2)
      
      // Haberleri ekrana yansıtan fonksiyon
      function displayNews(startIndex = 0) {
        const newsList = document.getElementById("news-list");
        newsList.innerHTML = "";
      
        // Haberleri tarihe göre sırala (en yeni en başta olacak şekilde)
        const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));
      
        // Belirtilen indeksten itibaren maksimum iki haber göster
        const endIndex = Math.min(startIndex + maxNewsToShow, sortedNews.length);
      
        for (let i = startIndex; i < endIndex; i++) {
          const n = sortedNews[i];
          const newsItem = createNewsItem(n);
          newsList.appendChild(newsItem);
        }
      }
      
      // Haber öğesi oluşturma fonksiyonu
      function createNewsItem(n) {
        const newsItem = document.createElement("li");
        newsItem.classList.add("news-item");
        newsItem.innerHTML = `
              <h2 class="news-title">${n.title}</h2>
              <p class="blog-post-meta">Date: ${n.date}</p>
              <p class="lead my-3">${n.summary}</p>
              <img class="news-image" src="${n.image}" alt="${n.title}">
              <a href="javascript:void(0)" class="read-more" onclick="toggleContent(${n.id}, this)">Weiterlesen</a>
              <div id="full-content-${n.id}" class="full-content" style="display:none;">
                  <p class="full-text">${n.content}</p>
              </div>
          `;
        return newsItem;
      }
      
      // Haber detaylarını açıp kapatan fonksiyon
      function toggleContent(id, linkElement) {
        const fullContent = document.getElementById(`full-content-${id}`);
        const image = document.querySelector(
          `#news-list img[alt='${news.find((n) => n.id === id).title}']`
        );
      
        // Eğer içerik görünmüyorsa göster, aksi takdirde gizle
        if (
          fullContent.style.display === "none" ||
          fullContent.style.display === ""
        ) {
          fullContent.style.display = "block"; // İçeriği göster
          image.style.display = "block"; // İlgili resmi de göster
          linkElement.style.display = "none"; // "Weiterlesen" butonunu gizle
        } else {
          fullContent.style.display = "none"; // İçeriği gizle
          linkElement.style.display = "inline"; // "Weiterlesen" butonunu tekrar göster
        }
      }
      
      // Bu fonksiyonu window objesine ekleyelim ki dışarıdan çağırabilelim
      window.toggleContent = toggleContent;
      
      // Yan sütunu güncelle
      function updateSidebar() {
        const latestNewsList = document.getElementById("latest-news-list");
        const archiveList = document.getElementById("archive-list");
        latestNewsList.innerHTML = "";
        archiveList.innerHTML = "";
      
        // Haberleri tarihe göre sırala (en yeni en başta olacak şekilde)
        const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));
      
        // Son iki haber için link ve resim
        sortedNews.slice(0, 2).forEach((n) => {
          const item = document.createElement("li");
          item.innerHTML = `
                  <a href="javascript:void(0)" onclick="displayFullNewsInMain(${n.id})">
                      <img src="${n.image}" alt="Thumbnail">
                      <span>${n.title}</span>
                  </a>
              `;
          latestNewsList.appendChild(item);
        });
      
        // Arşiv için link
        sortedNews.slice(2).forEach((n) => {
          const item = document.createElement("li");
          item.innerHTML = `<a href="javascript:void(0)" onclick="displayFullNewsInMain(${n.id})">${n.title}</a>`;
          archiveList.appendChild(item);
        });
      }
      
      // Tam haberin sol tarafta görünmesini sağlayan fonksiyon
      function displayFullNewsInMain(id) {
        const selectedNewsIndex = news.findIndex((n) => n.id === id);
        appCurrentIndex = selectedNewsIndex; // Seçilen haberin indeksini kaydet
        displayNews(appCurrentIndex); // Seçilen haberin olduğu yerden itibaren iki haber göster
      }
      
      // Bu fonksiyonun window objesine atanması
      window.displayFullNewsInMain = displayFullNewsInMain;
      
      // Sayfa yüklendiğinde çalışacak fonksiyon
      document.addEventListener("DOMContentLoaded", function () {
        displayNews(appCurrentIndex); // Haberleri göster
        updateSidebar(); // Yan sütunu güncelle
      });
      
      // loadNews fonksiyonu
      export function loadNews() {
          const newsSection = document.getElementById('news');
          
          if (!newsSection) {
            console.error("news section could not be found");
            return;  // Eğer 'news' ID'si bulunmazsa fonksiyondan çık
          }
        
          // Haberlerin yüklenmesi için DOM'a HTML yapısı ekleyin
          newsSection.innerHTML = `
            <section id="Neuigkeiten" class="news-section">
              <h1>Neuigkeiten von uns</h1>
              <h2>Wir sind ein engagiertes Team mit über 36 Jahren Erfahrung in der Branche. Unser Ziel ist es, unseren Kunden hochwertige Produkte und exzellenten Service zu bieten.</h2>
              <div class="row">
                <div class="col-left">
                  <div class="news" id="news-content">
                    <ul id="news-list">
                      <!-- Dinamik haberler burada yüklenecek -->
                    </ul>
                  </div>
                </div>
                <div class="col-right">
                  <div class="latest-news">
                    <h4>Neueste Beiträge</h4>
                    <ul id="latest-news-list">
                      <!-- Dinamik son haberler burada yüklenecek -->
                    </ul>
                  </div>
                  <div class="archive">
                    <h4>Archiv</h4>
                    <ul id="archive-list">
                      <!-- Dinamik arşiv haberleri burada yüklenecek -->
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          `;
        
          // HTML oluşturulduktan sonra haberleri ve yan sütunu yükle
          setTimeout(() => {
            displayNews();
            updateSidebar();
          }, 0);
        }
        