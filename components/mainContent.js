export function loadMainContent() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <main>
            <section>
                <h2>Willkommen bei Kuhlturm Ensotek</h2>
                <p>Wir sind stolz darauf, die Kultur der Region zu fördern und ein vielfältiges Veranstaltungsangebot zu bieten.</p>
            </section>
            <section id="veranstaltungen">
                <h2>Veranstaltungen</h2>
                <p>Entdecken Sie unsere kommenden Veranstaltungen und genießen Sie eine unvergessliche Zeit.</p>
            </section>
        </main>
    `;
}
