// ========================================
// IMPORTS
import axios from "axios";
// ========================================

// ========================================
// DOM-ELEMENT
// ========================================
const form = document.querySelector(".review-form");
const submitBtn = document.querySelector("button[type='submit']");
const cancelBtn = document.querySelector('.cancel-btn');

// ========================================
// KONSTANTER
let inputBookTitle = "";
let inputReviewer = "";
let inputReview = "";
let inputAuthor = "";
let inputRating = "";
let editingId = null; // null if creating new, otherwise stores review id being edited
// ========================================
const API_URL = "http://localhost:3000/reviews";

// ========================================
// HJÄLPFUNKTIONER
// ========================================

/**
 * Kontrollerar om alla formulärfält är ifyllda
 */
const checkInputs = () => {
  inputReviewer = form.elements.reviewer.value.trim();
  inputBookTitle = form.elements.bookTitle.value.trim();
  inputReview = form.elements.review.value.trim();
  inputAuthor = form.elements.author.value.trim();
  inputRating = form.elements.rating.value.trim();
  
  if (!inputReviewer || !inputReview || !inputBookTitle || !inputAuthor || !inputRating) {
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
      <button class="edit-btn" data-id="${review.id}">✏️ Redigera</button>
    `;

    reviewsContainer.appendChild(reviewDiv);
  });

  // Wire up delete button event listeners after rendering
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });

  // Wire up edit button event listeners after rendering
  const editBtns = document.querySelectorAll('.edit-btn');
  editBtns.forEach((btn) => {
    btn.addEventListener('click', handleEdit);
  });
};

/**
 * Hanterar radering av en recension
 */
const handleDelete = async (e) => {
  const reviewId = e.currentTarget.dataset.id;

  // Visa bekräftelsedialog
  const ok = confirm('Är du säker på att du vill radera den här recensionen?');
  if (!ok) return;

  try {
    // Skicka DELETE-request till backend
    const response = await axios.delete(`${API_URL}/${reviewId}`);

    // Anta att backend returnerar 200 vid framgång
    if (response.status === 200 || response.status === 204) {
      alert('Recension raderad.');
      // Ladda om recensioner
      await loadReviews();
    } else {
      alert('Kunde inte radera recensionen.');
    }
  } catch (error) {
    console.error('Fel vid radering:', error);
    if (error.response && error.response.status === 404) {
      alert('Recension hittades inte.');
    } else {
      alert('Kunde inte radera recensionen.');
    }
  }
};

/**
 * Hanterar när användaren klickar redigera
 */
const handleEdit = async (e) => {
  const reviewId = e.currentTarget.dataset.id;

  // find the review from the current displayed reviews by fetching from backend
  try {
    const response = await axios.get(`${API_URL}`);
    const reviewsList = response.data || [];
    const review = reviewsList.find((r) => r.id === parseInt(reviewId));
    if (!review) return alert('Recension hittades inte');

    enterEditMode(review);
  } catch (error) {
    console.error('Fel vid läsning för edit:', error);
    alert('Kunde inte läsa recensionen för redigering');
  }
};

/**
 * Enter edit mode: prefill the form and set editingId
 */
const enterEditMode = (review) => {
  editingId = review.id;
  form.elements.reviewer.value = review.reviewer;
  form.elements.bookTitle.value = review.bookTitle;
  form.elements.author.value = review.author;
  form.elements.review.value = review.review;
  form.elements.rating.value = review.rating.toString();
  submitBtn.textContent = 'Uppdatera recension';
  cancelBtn.style.display = 'inline-block';
  checkInputs();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Exit edit mode: reset the form
 */
const exitEditMode = () => {
  editingId = null;
  form.reset();
  submitBtn.textContent = 'Publicera recension';
  cancelBtn.style.display = 'none';
  checkInputs();
};

/**
 * Hämtar och visar alla recensioner från servern
 */
const loadReviews = async () => {
  try {
    const response = await axios.get(API_URL);

    // förvänta oss en array i response.data
    const reviews = response.data || [];
    displayReviews(reviews);
  } catch (error) {
    console.error('Fel vid hämtning av recensioner:', error);
    const reviewsContainer = document.querySelector('.reviews');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = '<p>Kunde inte ladda recensioner just nu.</p>';
    }
  }
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

  // Collect form values from the DOM
  inputReviewer = form.elements.reviewer.value.trim();
  inputBookTitle = form.elements.bookTitle.value.trim();
  inputReview = form.elements.review.value.trim();
  inputAuthor = form.elements.author.value.trim();
  inputRating = form.elements.rating.value.trim();

  if (!inputReviewer || !inputBookTitle || !inputReview || !inputAuthor || !inputRating) {
    return alert('Fyll i alla fält!');
  }

  // Create reviewData object
  const reviewData = {
    reviewer: inputReviewer,
    bookTitle: inputBookTitle,
    author: inputAuthor,
    review: inputReview,
    rating: parseInt(inputRating),
  };

  // Disable submit until request completes
  submitBtn.disabled = true;

  try {
    // If editingId is set, send PUT request to update review
    let response;
    if (editingId) {
      response = await axios.put(`${API_URL}/${editingId}`, reviewData);
    } else {
      response = await axios.post(API_URL, reviewData);
    }

    if (response.status === 201 || response.status === 200) {
      const successMsg = editingId ? 'Recension uppdaterad!' : 'Review sparades!';
      alert(successMsg);
      exitEditMode();
      // Reload reviews to show the updated one
      await loadReviews();
    } else {
      console.error('Unexpected response:', response);
      alert('Ett fel uppstod vid sparande.');
    }
  } catch (error) {
    console.error('Fel vid skapande av recension:', error);
    alert('Kunde inte skapa recensionen.');
  } finally {
    // Restore button state via checkInputs
    checkInputs();
  }
});

// Cancel edit button
cancelBtn.addEventListener('click', () => {
  exitEditMode();
});

/**
 * Laddar recensioner när sidan laddas
 */
window.addEventListener("load", async () => {
  await loadReviews();
});
