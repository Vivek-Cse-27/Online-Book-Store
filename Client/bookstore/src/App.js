import React, { useState } from 'react';
import './App.css';
import "./index.css";

// Components
import { BookList } from './Components/product/bookList';
import { BookDetails } from './Components/product/bookDetails';
import { Navbar } from './Components/common/navbar';

// Data
import { sampleBooks } from "./book.js";

const App = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={0} />
      
      <main className="p-5 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Directly passing the imported sampleBooks */}
          <BookList books={sampleBooks} onBookSelect={setSelectedBook} />
          
          {selectedBook && (
            <BookDetails 
              book={selectedBook} 
              onClose={() => setSelectedBook(null)} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;