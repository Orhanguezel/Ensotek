function calculateWetBulbTemperature() {
    const temperature = parseFloat(document.getElementById('temperature').value);
    const humidity = parseFloat(document.getElementById('humidity').value);

    if (isNaN(temperature) || isNaN(humidity) || humidity < 0 || humidity > 100) {
        document.getElementById('result').innerText = "Bitte geben Sie gültige Werte ein.";
        return;
    }

    const wetBulbTemperature = temperature * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) +
                               Math.atan(temperature + humidity) - Math.atan(humidity - 1.676331) +
                               0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
                               4.686035;

    document.getElementById('result').innerText = "Feuchtkugeltemperatur: " + wetBulbTemperature.toFixed(2) + " °C";
}
