let previousRatings = JSON.parse(localStorage.getItem('ratings')) || []; // Bewertungen aus localStorage laden
document.getElementById('submit-rating').addEventListener('click', submitRating);
displayRatings(); // Bewertungen direkt anzeigen, wenn die Seite geladen wird
displayAverageRating(); // Durchschnittliche Bewertung direkt anzeigen, wenn die Seite geladen wird
function submitRating() {
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const stars = parseInt(document.getElementById('stars').value);
    // Überprüfen der Eingaben
    if (!name || !comment || isNaN(stars) || stars < 1 || stars > 5) {
        alert("Bitte alle Felder korrekt ausfüllen.");
        return;
    }
    
    const rating = { name, comment, stars };
    previousRatings.push(rating); // Bewertung zur Liste hinzufügen
    localStorage.setItem('ratings', JSON.stringify(previousRatings)); // Bewertungen speichern
    
    // Eingabefelder zurücksetzen
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
    document.getElementById('stars').value = '';
    
    displayRatings(); // Bewertungen neu anzeigen
    displayAverageRating(); // Durchschnittliche Bewertung aktualisieren
}
function displayRatings() {
    const previousRatingsList = document.getElementById('previous-ratings');
    previousRatingsList.innerHTML = ''; // Listenelemente zurücksetzen
    // Durch die Bewertungen iterieren und in der Liste anzeigen
    previousRatings.forEach(rating => {
        const li = document.createElement('li');
        li.textContent = `${rating.name}: ${rating.comment} - ★${rating.stars}`;
        previousRatingsList.appendChild(li);
    });
}
function displayAverageRating() {
    const averageRatingContainer = document.getElementById("average-rating-container");
    const averageRatingStars = document.getElementById("average-rating-stars"); // Element für Sterne
    if (previousRatings.length === 0) {
        averageRatingContainer.style.display = "none"; // Verstecke den Container, wenn keine Bewertungen vorhanden sind
        return;
    }
    const totalStars = previousRatings.reduce((sum, rating) => sum + rating.stars, 0);
    const average = (totalStars / previousRatings.length).toFixed(1);
    averageRatingStars.innerHTML = ''; // Alte Sterne zurücksetzen
    
    // Sterne für die Durchschnittsbewertung generieren
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.textContent = (i < Math.round(average)) ? '★' : '☆'; // Füllsterne und outlined Sterne
        averageRatingStars.appendChild(star);
    }
    averageRatingContainer.style.display = "block"; // Zeige den Container an
}
// Event Listener für das Anzeigen der Bewertungen
document.getElementById('display-reviews').addEventListener('click', () => {
    displayRatings(); 
    displayAverageRating(); 
});