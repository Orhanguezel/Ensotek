// Form gönderme işlemi
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Sayfa yeniden yüklenmesini engelle

    const formData = new FormData(this);

    fetch('contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('Ihre Nachricht wurde erfolgreich gesendet.');
            document.getElementById('contact-form').reset(); // Formu sıfırla
        } else {
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    });
});
