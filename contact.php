<?php
// Formdan gelen verileri al
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

// E-posta ayarları
$to = "orhanguzell@gmail.com"; // E-posta gönderilecek adres
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// E-posta içeriği
$email_content = "
    <h2>Neue Nachricht</h2>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>E-Mail:</strong> {$email}</p>
    <p><strong>Betreff:</strong> {$subject}</p>
    <p><strong>Nachricht:</strong><br>{$message}</p>
";

// E-posta gönderme fonksiyonu
if (mail($to, $subject, $email_content, $headers)) {
    echo "success"; // E-posta başarıyla gönderildiğinde "success" döndür
} else {
    echo "error"; // Bir hata olursa "error" döndür
}
?>
