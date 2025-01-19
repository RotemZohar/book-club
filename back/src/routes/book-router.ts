import { Router } from "express";
import { ClubModel } from "../models/club";
import { BookModel, BookInterface } from "../models/book";

const bookRouter = Router();

// get all - MAYBE NOT NEEDED
bookRouter.get("/", async (req, res) => {
  const books = await BookModel.find();
  res.status(200).json({ books });
});

// get by id
bookRouter.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).json("Parameter is missing");
  }

  try {
    const book = await BookModel.findById({ _id: bookId });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error("Error getting book:", err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

// create book
bookRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    author,
    pages,
    cover,
    startDate,
    endDate,
    previewLink,
    clubId,
  } = req.body;

  if (
    !title ||
    !description ||
    !author ||
    !pages ||
    !cover ||
    !startDate ||
    !endDate ||
    !previewLink ||
    !clubId
  ) {
    return res.status(400).json({
      message: "Missing required parameters. Please provide all fields.",
    });
  }

  try {
    const newBook = await BookModel.create({
      title,
      description,
      author,
      pages,
      cover,
      startDate,
      endDate,
      previewLink,
      clubId,
    });

    const updatedClub = await ClubModel.findByIdAndUpdate(
      clubId,
      { $push: { books: newBook._id } },
      { new: true }
    );

    if (!updatedClub) {
      return res
        .status(404)
        .json({ message: "Club not found. Unable to add book." });
    }

    return res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (err) {
    console.error("Error creating book:", err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

// update info
bookRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    author,
    pages,
    cover,
    startDate,
    previewLink,
    endDate,
  } = req.body;

  try {
    /// TODO: make a find by id func
    const book = await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updateFields: Partial<BookInterface> = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (author) updateFields.author = author;
    if (pages) updateFields.pages = pages;
    if (cover) updateFields.cover = cover;
    if (startDate) updateFields.startDate = startDate;
    if (previewLink) updateFields.previewLink = previewLink;
    if (endDate) updateFields.endDate = endDate;

    const updatedBook = await BookModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    return res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (err) {
    console.error("Error updating book:", err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

// delete book
bookRouter.delete("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID parameter is missing" });
  }

  try {
    const bookToDelete = await BookModel.findById(bookId);

    if (!bookToDelete) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedClub = await ClubModel.findByIdAndUpdate(
      bookToDelete.clubId,
      { $pull: { books: bookId } },
      { new: true }
    );

    if (!updatedClub) {
      return res
        .status(404)
        .json({ message: "Club not found or unable to update" });
    }

    await BookModel.findByIdAndDelete(bookId);

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

export default bookRouter;
