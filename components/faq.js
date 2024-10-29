const faqData = [
    {
        question: "Was ist eine Kühlanlage?",
        answer: "Eine Kühlanlage ist ein Gerät, das dazu dient, die Temperatur eines Raumes oder eines Bereiches zu senken."
    },
    {
        question: "Wie funktioniert eine Kühlanlage?",
        answer: "Eine Kühlanlage funktioniert, indem sie Wärme aus einem Raum aufnimmt und diese nach draußen abführt."
    },
    {
        question: "Welche Arten von Kühlanlagen gibt es?",
        answer: "Es gibt verschiedene Arten von Kühlanlagen, wie beispielsweise Klimaanlagen, Kühlschränke und Kühltruhen."
    },
    {
        question: "Wie oft muss eine Kühlanlage gewartet werden?",
        answer: "Es wird empfohlen, eine Kühlanlage mindestens einmal jährlich zu warten, um eine optimale Funktion zu gewährleisten."
    },
    {
        question: "Was kostet eine Kühlanlage?",
        answer: "Die Kosten für eine Kühlanlage variieren je nach Typ und Leistung. Klimaanlagen kosten in der Regel zwischen 500 und 3000 Euro."
    }
];

// FAQ öğelerini sayfaya yüklemek
document.addEventListener("DOMContentLoaded", () => {
    const faqContainer = document.getElementById("faq-container");

    faqData.forEach(item => {
        // Soru elementi
        const questionElement = document.createElement("div");
        questionElement.classList.add("faq-question");
        questionElement.innerHTML = `<span class="faq-icon">&#9654;</span> ${item.question}`;

        // Cevap elementi
        const answerElement = document.createElement("div");
        answerElement.classList.add("faq-answer");
        answerElement.textContent = item.answer;
        answerElement.style.maxHeight = "0";

        // Soru tıklandığında cevabı göster/gizle
        questionElement.addEventListener("click", () => {
            const isOpen = answerElement.style.maxHeight !== "0px";
            answerElement.style.maxHeight = isOpen ? "0" : `${answerElement.scrollHeight}px`;
            questionElement.querySelector('.faq-icon').innerHTML = isOpen ? "&#9654;" : "&#9660;";
        });

        // Soru ve cevapları kapsayıcıya ekle
        const faqItem = document.createElement("div");
        faqItem.classList.add("faq-item");
        faqItem.appendChild(questionElement);
        faqItem.appendChild(answerElement);

        faqContainer.appendChild(faqItem);
    });
});