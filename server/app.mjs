import cors from "cors"
import express from "express"

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// In-memory storage for reviews
let reviews = [];
let nextId = 1;

// GET all reviews
app.get("/reviews", (req, res) => {
  res.json(reviews);
});

// POST a new review
app.post("/reviews", (req, res) => {
  const { reviewer, bookTitle, author, review, rating } = req.body;

  // Validate required fields
  if (!reviewer || !bookTitle || !author || !review || !rating) {
    return res.status(400).json({ error: "Alla fält krävs" });
  }

  const newReview = {
    id: nextId++,
    reviewer,
    bookTitle,
    author,
    review,
    rating: parseInt(rating),
    timestamp: new Date().toISOString(),
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// DELETE a review by ID
app.delete("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const index = reviews.findIndex((r) => r.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Recension hittades inte" });
  }

  const deletedReview = reviews.splice(index, 1)[0];
  res.json({ success: true, deleted: deletedReview });
});

export default app;