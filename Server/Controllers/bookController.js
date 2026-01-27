const { Book } = require('../Models/book'); // Destructuring because your model exports { Book }

const getBooks = async (req, res) => {
    const books = await Book.find({});
    res.json(books);
};

const addBook = async (req, res) => {
    console.log('Request to add book received:', req.body);
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: "Failed to add book" });
    }
};

const updateBook = async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
};

const deleteBook = async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted", book });
};

module.exports = { getBooks, addBook, updateBook, deleteBook };