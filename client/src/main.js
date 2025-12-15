import axios from "axios";

// ========================================
// DOM-ELEMENT
// ========================================
const form = document.querySelector(".review-form");
const submitBtn = document.querySelector("button[type='submit']");

const API_URL = "http://localhost:3000";

/**
 * Kontrollerar om alla formulärfält är ifyllda
 */
const checkInputs = () => {
  const bookTitle = form.elements.bookTitle.value;
  const author = form.elements.author.value;
  const reviewer = form.elements.reviewer.value;
  const rating = form.elements.rating.value;
  const review = form.elements.review.value;

  if (
    !bookTitle ||
    !author ||
    !reviewer ||
    rating < 0 ||
    rating > 5 ||
    !review
  ) {
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
  }
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

    addDeleteEventListeners();

  });

  // TODO: Lägg till event listeners på radera-knappar
};

/**
 * Hämtar och visar alla recensioner från servern
 */
const loadReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews`);
    
    if (response.data.success) {
      displayReviews(response.data.data);
    } else {
      console.error("Failed to load reviews");
    }
  } catch (error) {
    console.error("Kunde ej hämta recensioner:", error);
    alert("Kunde ej hämta recensioner");
  }
};

/**
 * Hanterar radering av en recension
 */
const handleDelete = async (e) => {
  const id = e.currentTarget?.dataset?.id || e.target?.dataset?.id;
  if (!id) return;

  const ok = confirm("Vill du verkligen radera den här recensionen?");
  if (!ok) return;

  try {
    const response = await axios.delete(`${API_URL}/reviews/${id}`);
    if (response.data.success) {
      loadReviews(); // Reload reviews after delete
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    alert("Kunde ej radera recensionen");
  }
};

/**
 * Lägger till event listeners på alla radera-knappar
 */
const addDeleteEventListeners = () => {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
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

  const bookTitle = form.elements.bookTitle.value;
  const author = form.elements.author.value;
  const reviewer = form.elements.reviewer.value;
  const rating = form.elements.rating.value;
  const review = form.elements.review.value;

  const bookData = {
    bookTitle,
    author,
    reviewer,
    rating,
    review,
  };

  try {
    const response = await axios.post(`${API_URL}/save-review`, bookData);
    
    if (response.data.success) {
      alert("Recension sparad!");
      form.reset();
      checkInputs();
      loadReviews(); // Reload reviews after save
    }
  } catch (error) {
    console.error("Error saving review:", error);
    alert("Kunde ej spara recensionen");
  }
});
  // TODO: Hämta alla värden från formuläret
  // TODO: Skapa ett reviewData-objekt
  // TODO: Skicka POST-request till backend
  // TODO: Om det lyckas: visa meddelande, rensa formuläret, ladda om recensioner
  // TODO: Hantera fel
;

/**
 * Laddar recensioner när sidan laddas
 */
window.addEventListener("load", async () => {
  loadReviews();
});