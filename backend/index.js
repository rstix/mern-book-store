import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURI } from "./config.js";
import { Book } from "./models/bookModel.js";

const app = express();

// middleware to parse the body
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("HEY");
});

// POST route to save a new book
app.post('/books', async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.author ||
      !req.body.publishYear
    ) {
      return res.status(400).send({ message: "Send all fields." });
    }
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// GET route to get all book
app.get('/books', async (req,res) => {
	try {
		const books = await Book.find({})

		return res.status(200).json({
			count: books.length,
			data: books
		})
	} catch (err) {
		console.error(err.message)
		res.status(500).send({message: err.message})
	}
})

mongoose
  .connect(mongoDBURI)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log("listening on " + PORT);
    });
  })
  .catch((err) => console.error(err));
