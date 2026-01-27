import API_BASE_URL from '../apiConfig';

const BOOKS_API_URL = `${API_BASE_URL}/books`;


export const bookService = {
    // Fetch all books
    getAllBooks: async () => {
        try {
            const response = await fetch(`${BOOKS_API_URL}`);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Fetch a single book by ID
    getBookById: async (id) => {
        try {
            const response = await fetch(`${BOOKS_API_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Book not found');
            }
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Fetch books by category/genre
    getBooksByCategory: async (category) => {
        try {
            const response = await fetch(`${BOOKS_API_URL}/category/${category}`);
            if (!response.ok) {
                throw new Error('Failed to fetch books for this category');
            }
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Search books by title or author
    searchBooks: async (query) => {
        try {
            const response = await fetch(`${BOOKS_API_URL}/search?q=${query}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
