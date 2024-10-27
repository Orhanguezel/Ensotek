<?php
// Formdan gelen verileri al
$vorname = $_POST['vorname'];
$nachname = $_POST['nachname'];
$firma = $_POST['firma'];
$email = $_POST['email'];
$postleitzahl = $_POST['postleitzahl'];
$berufsbezeichnung = $_POST['berufsbezeichnung'];
$markttyp = $_POST['markttyp'];
$stelle = $_POST['stelle'];
$tower_seriennummer = $_POST['tower_seriennummer'];
$nachricht = $_POST['nachricht'];

// E-posta ayarları
$to = "orhanguzell@gmail.com"; // E-posta gönderilecek adres
$subject = "Neue Anfrage von Website"; // E-posta başlığı
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// E-posta içeriği
$email_content = "
    <h2>Neue Anfrage</h2>
    <p><strong>Vorname:</strong> {$vorname}</p>
    <p><strong>Nachname:</strong> {$nachname}</p>
    <p><strong>Firma:</strong> {$firma}</p>
    <p><strong>E-Mail:</strong> {$email}</p>
    <p><strong>Postleitzahl:</strong> {$postleitzahl}</p>
    <p><strong>Berufsbezeichnung:</strong> {$berufsbezeichnung}</p>
    <p><strong>Markttyp:</strong> {$markttyp}</p>
    <p><strong>Stelle:</strong> {$stelle}</p>
    <p><strong>Turm Seriennummer:</strong> {$tower_seriennummer}</p>
    <p><strong>Nachricht:</strong><br>{$nachricht}</p>
";

// E-posta gönderme fonksiyonu
if (mail($to, $subject, $email_content, $headers)) {
    echo "success"; // E-posta başarıyla gönderildiğinde "success" döndür
} else {
    echo "error"; // Bir hata olursa "error" döndür
}
?>
