document.addEventListener("DOMContentLoaded", async () => {
  const pageType = document.body.dataset.pageType; // Sayfa türü alınır
  const itemTitles = document.getElementById("item-titles");
  const itemContent = document.getElementById("item-content");
  const gallery = document.getElementById("gallery");
  const backButtonTop = document.getElementById("back-button-top");
  const backButtonBottom = document.getElementById("back-button-bottom");
  const staticMessage = document.getElementById("static-message"); // Sabit mesaj

  let data; // Veriyi burada saklayacağız
  const sidebarTitle = document.querySelector(".sidebar h2"); // Başlık alanı seçilir

  try {
    // Sayfa türüne göre ilgili veri dosyasını dinamik olarak import et ve başlığı ayarla
    if (pageType === "articles") {
      data = await import("../data/articles-data.js").then(
        (module) => module.articles
      );
      sidebarTitle.textContent = "Artikel"; // Başlığı "Artikel" olarak ayarla
    } else if (pageType === "materials") {
      data = await import("../data/materials-data.js").then(
        (module) => module.materials
      );
      sidebarTitle.textContent = "Turmmaterialien"; // Başlığı "Turmmaterialien" olarak ayarla
    } else if (pageType === "products") {
      data = await import("../data/products-data.js").then(
        (module) => module.products
      );
      sidebarTitle.textContent = "Produkte"; // Başlığı "Produkte" olarak ayarla
    } else {
      console.error("Geçersiz sayfa türü.");
      return;
    }

    // Ana sayfayı göster
    function showMainPage() {
      itemContent.innerHTML = ""; // İçeriği temizle
      gallery.style.display = "flex"; // Galeriyi göster
      backButtonTop.classList.add("hidden"); // Geri düğmesini gizle
      backButtonBottom.classList.add("hidden"); // Geri düğmesini gizle
      staticMessage.style.display = "block"; // Sabit mesajı göster
      window.location.hash = ""; // Hash'i temizle
    }

    // Başlıkları sol menüye ve galeriye ekle
    data.forEach((item, index) => {
      const hashId = item.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${hashId}`;
      link.textContent = `${index + 1}. ${item.title}`;
      listItem.appendChild(link);
      itemTitles.appendChild(listItem);

      const regexImgTag = /<img[^>]+src="([^">]+)"/g;
      let imgMatch;
      while ((imgMatch = regexImgTag.exec(item.content)) !== null) {
        const imageSrc = imgMatch[1];
        const imageAlt = `Bild von ${item.title}`;

        const galleryDiv = document.createElement("div");
        galleryDiv.classList.add("gallery-item");

        const image = document.createElement("img");
        image.src = imageSrc;
        image.alt = imageAlt;

        const caption = document.createElement("p");
        caption.textContent = item.title;

        image.addEventListener("click", () => {
          window.location.hash = `#${hashId}`; // Hash'i güncelle
        });

        galleryDiv.appendChild(image);
        galleryDiv.appendChild(caption);
        gallery.appendChild(galleryDiv);
      }
    });

    // İçeriği göster
    // İçeriği göster
    function showItem(item) {
      itemContent.innerHTML = `<h2>${item.title}</h2>` + item.content; // Ürün başlığı ve içerik

      gallery.style.display = "none"; // Galeriyi gizle
      backButtonTop.classList.remove("hidden"); // Geri düğmelerini göster
      backButtonBottom.classList.remove("hidden");

      // İçeriğin görünür olması için sayfayı kaydır
      itemContent.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Hash değişimini dinleyerek ilgili içeriği gösterecek
    function handleHashChange() {
      const hash = window.location.hash.slice(1);
      const selectedItem = data.find(
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

    // Hash değişikliklerini dinle
    window.addEventListener("hashchange", handleHashChange);

    // Sayfa yüklendiğinde mevcut hash varsa ilgili içeriği göster
    handleHashChange();

    // Geri düğmelerine click olayları ekle
    backButtonTop.addEventListener("click", showMainPage);
    backButtonBottom.addEventListener("click", showMainPage);
  } catch (error) {
    console.error("Veri yükleme sırasında bir hata oluştu: ", error);
  }
});
