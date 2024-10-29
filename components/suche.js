import { articles } from '../data/articles-data.js';
import { materials } from '../data/materials-data.js';
import { news } from '../data/news-data.js';
import { products } from '../data/products-data.js';

const allData = [...articles, ...materials, ...news, ...products];

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResults = document.getElementById("search-results");

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchResults = document.getElementById("search-results");
  
    // Import relevant data
    import("../data/articles-data.js").then(module => {
      const articles = module.articles;
      import("../data/materials-data.js").then(module => {
        const materials = module.materials;
        import("../data/products-data.js").then(module => {
          const products = module.products;
          import("../data/news-data.js").then(module => {
            const news = module.news;
  
            // Combine all data
            const allData = [...articles, ...materials, ...products, ...news];
  
            if (searchButton && searchResults) {
              searchButton.addEventListener("click", performSearch);
            }
  
            function performSearch() {
              const searchTerm = searchInput.value.trim().toLowerCase();
              searchResults.innerHTML = ""; // Clear previous results
  
              if (searchTerm === "") {
                searchResults.innerHTML = "<p>Bitte geben Sie ein Suchbegriff ein.</p>";
                return;
              }
  
              // Store the search term in localStorage
              localStorage.setItem("searchTerm", searchTerm);
  
              // Filter the data (search)
              const results = allData.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.content.toLowerCase().includes(searchTerm)
              );
  
              if (results.length > 0) {
                results.forEach(result => {
                  const resultItem = document.createElement("div");
                  resultItem.classList.add("search-result-item");
  
                  // Highlight the search term
                  let contentSnippet = result.content.substring(0, 100);
                  const highlightRegex = new RegExp(`(${searchTerm})`, "gi");
                  contentSnippet = contentSnippet.replace(highlightRegex, `<span class="highlight">$1</span>`);
  
                  const hashId = result.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  
                  resultItem.innerHTML = `
                    <h3><a href="#${hashId}" class="search-link">${result.title}</a></h3>
                    <p>${contentSnippet}...</p>
                  `;
  
                  searchResults.appendChild(resultItem);
                });
  
                // Make links clickable
                const searchLinks = document.querySelectorAll(".search-link");
                searchLinks.forEach(link => {
                  link.addEventListener("click", (event) => {
                    event.preventDefault();
                    const hash = link.getAttribute("href").slice(1);
                    window.location.hash = hash;
                    handleHashChange();
                  });
                });
              } else {
                searchResults.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
              }
            }
  
            // Monitor hash changes and display the corresponding content
            function handleHashChange() {
              const hash = window.location.hash.slice(1);
              const selectedItem = allData.find(
                (item) =>
                  item.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "") === hash
              );
              if (selectedItem) {
                showItem(selectedItem);
              } else {
                showMainPage();
              }
            }
  
            // Show the content of the selected item and highlight the search term
            function showItem(item) {
              if (!searchResults) {
                console.error("Search results element not found.");
                return;
              }
  
              let contentHTML = `<h2>${item.title}</h2>` + item.content;
  
              // Highlight the search term
              const searchTerm = localStorage.getItem("searchTerm");
              if (searchTerm) {
                const highlightRegex = new RegExp(`(${searchTerm})`, "gi");
                contentHTML = contentHTML.replace(
                  highlightRegex,
                  `<span class="highlight">$1</span>`
                );
              }
  
              searchResults.innerHTML = contentHTML;
            }
  
            // Show the main page
            function showMainPage() {
              searchResults.innerHTML = "<p>Bitte geben Sie ein Suchbegriff ein, um zu suchen.</p>";
            }
  
            // Show the corresponding content if a hash is present when the page loads
            handleHashChange();
  
            // Monitor hash changes
            window.addEventListener("hashchange", handleHashChange);
          }).catch(error => console.error("Could not load news data:", error));
        }).catch(error => console.error("Could not load product data:", error));
      }).catch(error => console.error("Could not load material data:", error));
    }).catch(error => console.error("Could not load article data:", error));
  });
