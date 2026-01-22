import React, { useState } from 'react';
import './App.css';
import "./index.css";

// Components
// import { BookList } from './Components/product/bookList';
import { BookDetails } from './Components/product/bookDetails';
import { Loader } from './Components/common/loader';
import { Navbar } from './Components/common/navbar';
import { Home } from "./Pages/home";
// Data
// import { sampleBooks } from "./book.js";

const App = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Loader />
      <Navbar cartCount={0} />
          {/* Home page Added */}
          <Home onBookSelect={setSelectedBook} />
          {/* BookDetails */}
          {selectedBook && (
            <BookDetails 
              book={selectedBook} 
              onClose={() => setSelectedBook(null)} 
            />
          )}
    </div>
  );
};

export default App;