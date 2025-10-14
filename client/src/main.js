// ========================================
// IMPORTS
// ========================================

// ========================================
// DOM-ELEMENT
// ========================================
const form = document.querySelector(".review-form");
const submitBtn = document.querySelector("button[type='submit']");

// ========================================
// KONSTANTER
// ========================================
const API_URL = "http://localhost:3000/reviews";

// ========================================
// HJÄLPFUNKTIONER
// ========================================

/**
 * Kontrollerar om alla formulärfält är ifyllda
 */
const checkInputs = () => {
  // TODO: Hämta värden från alla input-fält
  // TODO: Aktivera/inaktivera submit-knappen baserat på om alla fält är ifyllda
};

/**
 * Skapar HTML för stjärnbetyg
 */
const createStars = (rating) => {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="star">⭐</span>';
    } else {
      stars += '<span class="star empty">☆</span>';
    }
  }
  return stars;
};

/**
 * Visar alla recensioner på sidan
 */
const displayReviews = (reviews) => {
  const reviewsContainer = document.querySelector(".reviews");
  reviewsContainer.innerHTML = "";

  if (reviews.length === 0) {
    reviewsContainer.innerHTML = `
      <div class="empty-state">
        <h3>Inga recensioner ännu</h3>
        <p>Bli den första att skriva en recension!</p>
      </div>
    `;
    return;
  }

  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";

    const date = new Date(review.timestamp).toLocaleDateString("sv-SE");
    const stars = createStars(review.rating);

    reviewDiv.innerHTML = `
      <div class="review-header">
        <div class="book-info">
          <h3>${review.bookTitle}</h3>
          <p class="book-author">av ${review.author}</p>
        </div>
        <div class="rating">${stars}</div>
      </div>
      <div class="review-meta">
        <span class="reviewer">Recensent: ${review.reviewer}</span>
        <span class="date">${date}</span>
      </div>
      <p class="review-content">${review.review}</p>
      <button class="delete-btn" data-id="${review.id}">🗑️ Radera</button>
    `;

    reviewsContainer.appendChild(reviewDiv);
  });

  // TODO: Lägg till event listeners på radera-knappar
};

/**
 * Hanterar radering av en recension
 */
const handleDelete = async (e) => {
  // TODO: Hämta review ID från knappen
  // TODO: Visa bekräftelsedialog
  // TODO: Skicka DELETE-request till backend
  // TODO: Ladda om recensioner om det lyckas
};

/**
 * Hämtar och visar alla recensioner från servern
 */
const loadReviews = async () => {
  // TODO: Skicka GET-request till backend
  // TODO: Visa recensionerna med displayReviews()
  // TODO: Hantera fel
};

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Lyssna på ändringar i formuläret
 */
form.addEventListener("input", checkInputs);

/**
 * Hanterar när formuläret skickas
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // TODO: Hämta alla värden från formuläret
  // TODO: Skapa ett reviewData-objekt
  // TODO: Skicka POST-request till backend
  // TODO: Om det lyckas: visa meddelande, rensa formuläret, ladda om recensioner
  // TODO: Hantera fel
});

/**
 * Laddar recensioner när sidan laddas
 */
window.addEventListener("load", async () => {
  // TODO: Anropa loadReviews()
});
