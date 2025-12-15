import cors from "cors";
import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const filePath = `${__dirname}/reviews.json`;

const getReviews = () => {
  try {
    if (!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, "utf-8");
    const reviews = JSON.parse(data);

    if (!Array.isArray(reviews)) return [];

    return reviews;
  } catch (error) {
    console.error("Error reading reviews:", error);
    return [];
  }
};

const saveReview = (bookReviews) => {
  let reviews = [];

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8"); // Läser filens innehåll som text
      reviews = JSON.parse(data); // Gör om texten till JavaScript-format (oftast en array)

      // Om filen inte innehåller en array, återställ den till en tom array
      if (!Array.isArray(reviews)) reviews = [];
    } catch (error) {
      // Om JSON är trasigt eller något går fel -> nollställ reviews
      console.error("Error during read of reviews.json:", error);
      reviews = [];
    }
  }

  reviews.push(bookReviews);

  try {
    console.log({ reviews: reviews });

    // Sparar tillbaka alla recensioner till reviews.json
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
  } catch (error) {
    // Skriv ut error meddelandet i terminalen
    console.error("Error writing to reviews.json");
  }
};

const DeleteReview = (ReveiwIDid) => {
  try {
    if (!fs.existsSync(filePath)) return false;

    const data = fs.readFileSync(filePath, "utf-8");
    let reviews = JSON.parse(data);

    const filteredReviews = reviews.filter((review) => review.id !== ReveiwIDid);

    if (reviews.length === filteredReviews.length) return false;
    
    fs.writeFileSync(filePath, JSON.stringify(filteredReviews, null, 2));
    return true;
  } catch (error) {
    console.log("Error during delete:", error);
    return false; 
  }
};
app.get("/reviews", (req, res)  => {
    try {
        const reviews = getReviews();
        
        res.status(200).json({success: true, data: reviews})
    } catch (error) {
        console.error("Error reading file:", error)
 
        res.status(500).json({ success: false });
      }
});

app.post("/save-review", (req, res) => {
  const { bookTitle, author, reviewer, rating, review } = req.body;

  console.log("data:", bookTitle, author, reviewer, rating, review);

  const id = uuidv4();

  try {
    const bookData = {
      bookTitle,
      author,
      reviewer,
      rating,
      review,
      id,
      timestamp: Date.now(),
    };

    console.log("bookData:", bookData);

    saveReview(bookData);

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});



app.delete("/reviews/:id", (req, res) => {
  console.log("delete");  
  const ReveiwID = req.params.id;

  console.log({ID: ReveiwID});

  try {
    const deleted = DeleteReview(ReveiwID)

    if (deleted) res.status(200).json({ success: true });
    else res.status(404).json({ success: false, });
  } catch (error) {
    console.log({Error: error});
    res.status(500).json({ success: false });
  }
});

    export default app;
