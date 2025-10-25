let previousRatings = JSON.parse(localStorage.getItem('ratings')) || [];
document.getElementById('submit-rating').addEventListener('click', submitRating);
displayRatings();
displayAverageRating();
function submitRating() {
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const stars = parseInt(document.getElementById('stars').value);
    if (!name || !comment || isNaN(stars) || stars < 1 || stars > 5) {
        alert("Bitte alle Felder korrekt ausfüllen.");
        return;
    }

    const rating = { name, comment, stars };
    previousRatings.push(rating);
    localStorage.setItem('ratings', JSON.stringify(previousRatings));

    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
    document.getElementById('stars').value = '';

    displayRatings();
    displayAverageRating();
}
function displayRatings() {
    const previousRatingsList = document.getElementById('previous-ratings');
    previousRatingsList.innerHTML = '';
    if (previousRatings.length === 0) {
        previousRatingsList.style.display = "none";
    } else {
        previousRatingsList.style.display = "block";
        previousRatings.forEach(rating => {
            const li = document.createElement('li');
            li.textContent = `${rating.name}: ${rating.comment} - ★${rating.stars}`;
            previousRatingsList.appendChild(li);
        });
    }
}
function displayAverageRating() {
    const averageRatingContainer = document.getElementById("average-rating-container");
    const averageRatingStars = document.getElementById("average-rating-stars");
    if (previousRatings.length === 0) {
        averageRatingContainer.style.display = "none";
        return;
    }

    const totalStars = previousRatings.reduce((sum, rating) => sum + rating.stars, 0);
    const average = (totalStars / previousRatings.length).toFixed(1);
    averageRatingStars.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.textContent = (i < Math.round(average)) ? '★' : '☆';
        averageRatingStars.appendChild(star);
    }

    averageRatingContainer.style.display = "block";
}

document.getElementById('display-reviews').addEventListener('click', () => {
    displayRatings();
    displayAverageRating();
});