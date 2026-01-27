import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/authContext';
import { bookService } from '../../Services/bookService';
import { Loader } from '../../Components/common/loader';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
                {icon}
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </div>
);

export const AdminDashboard = ({ onBackToStore }) => {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        price: '',
        genre: '',
        stock: '',
        description: '',
        image: '',
        isBestSeller: false
    });

    useEffect(() => {
        if (activeTab === 'books' || activeTab === 'overview') {
            fetchBooks();
        }
    }, [activeTab, token]);

    const fetchBooks = async () => {
        setLoading(true);
        const result = await bookService.getAllBooks();
        if (result.success) {
            setBooks(result.data);
        }
        setLoading(false);
    };

    const handleAddBook = async (e) => {
        e.preventDefault();

        if (!token) {
            alert('Authentication error: Token missing. Please log out and log in again.');
            return;
        }

        setLoading(true);
        const result = await bookService.addBook({ ...newBook, id: Date.now() }, token);
        if (result.success) {
            alert('Book added successfully!');
            setShowAddModal(false);
            setNewBook({
                title: '', author: '', price: '', genre: '',
                stock: '', description: '', image: '', isBestSeller: false
            });
            fetchBooks();
        } else {
            alert('Error: ' + result.error);
        }
        setLoading(false);
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            if (!token) {
                alert('Authentication error: Token missing. Please log out and log in again.');
                return;
            }
            setLoading(true);
            const result = await bookService.deleteBook(id, token);
            if (result.success) {
                fetchBooks();
            } else {
                alert('Error: ' + result.error);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {loading && <Loader isLoading={true} message="Processing..." />}

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6 fixed h-full z-20">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-lg font-black tracking-tighter">SELLER<span className="text-indigo-600">Portal</span></span>
                </div>

                <nav className="space-y-1 flex-1">
                    {[
                        { id: 'overview', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { id: 'books', label: 'Inventory', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13' },
                        { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={onBackToStore}
                    className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Exit Dashboard
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-indigo-600 capitalize">{activeTab}</h1>
                        <p className="text-slate-500 font-medium">Welcome back, {user?.name || 'Seller'}! Manage your store inventory.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-2 pr-4 shadow-sm">
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                                {user?.name?.charAt(0) || 'S'}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black text-slate-900">{user?.name || 'Seller'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Seller</p>
                            </div>
                        </div>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                        <StatCard
                            title="Total Books"
                            value={books.length}
                            color="bg-indigo-500 text-indigo-500"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                        />
                        <StatCard
                            title="Low Stock Alert"
                            value={books.filter(b => b.stock < 5).length}
                            color="bg-red-500 text-red-500"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        />
                        <StatCard
                            title="Top Category"
                            value={books.length > 0 ? (Object.entries(books.reduce((acc, b) => { acc[b.genre] = (acc[b.genre] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0][0]) : 'None'}
                            color="bg-green-500 text-green-500"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                        />
                    </div>
                )}

                {activeTab === 'books' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="px-8 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Inventory Management</h2>
                                <p className="text-slate-500 text-sm font-medium">Control your book catalog and stock levels</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 group"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Add New Book
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Book Details</th>
                                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Price</th>
                                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Stock</th>
                                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {books.map((book) => (
                                        <tr key={book._id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={book.image || 'https://via.placeholder.com/150'} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                                                    <div>
                                                        <p className="font-black text-slate-900 line-clamp-1">{book.title}</p>
                                                        <p className="text-xs font-bold text-slate-400">{book.author}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    {book.genre}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right font-black text-slate-900">
                                                Rs. {book.price}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`font-black ${book.stock < 5 ? 'text-red-500' : 'text-slate-900'}`}>{book.stock}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleDeleteBook(book._id || book.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Book Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-10 py-8 border-b border-slate-50 bg-indigo-600 text-white">
                            <h2 className="text-3xl font-black tracking-tight">Add New Book</h2>
                            <p className="text-indigo-100 font-medium opacity-80 mt-1">Fill in the details to list a new book</p>
                        </div>
                        <form onSubmit={handleAddBook} className="p-10 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Title</label>
                                    <input required type="text" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Author</label>
                                    <input required type="text" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Price (Rs.)</label>
                                    <input required type="number" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Genre</label>
                                    <input required type="text" value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Stock</label>
                                    <input required type="number" value={newBook.stock} onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Image URL</label>
                                    <input required type="text" value={newBook.image} onChange={(e) => setNewBook({ ...newBook, image: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900" />
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                                <textarea rows="3" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900 resize-none"></textarea>
                            </div>
                            <div className="mt-8 flex gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Book Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

