export function loadNews() {
    const news = document.getElementById('news');
    news.innerHTML = `
        <section id="Neuigkeiten" class="news-section">
            <h1>Neuigkeiten von uns</h1>
            <h2>Wir sind ein engagiertes Team mit über 36 Jahren Erfahrung in der Branche. Unser Ziel ist es, unseren Kunden hochwertige Produkte und exzellenten Service zu bieten.</h2>
            <div class="row">
                <div class="col-md-8">
                    <div class="news">
                        <ul id="news-list">
                            <!-- Dinamik haberler burada yüklenecek -->
                        </ul>
                    </div>
                </div>
                <div class="col-md-4">
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
}

loadNews();
