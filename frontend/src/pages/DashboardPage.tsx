import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api'; // Use our centralized api service
import Button from '../components/Button'; // Import our reusable button

// Define the shape of a Note object
interface Note {
    _id: string;
    content: string;
    createdAt: string;
}

// Define the shape of a User object
interface User {
    name: string;
    email: string;
}

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // This function handles the logic for fetching all necessary data
        const fetchData = async () => {
            try {
                // Fetch user data and notes in parallel for efficiency
                const [userResponse, notesResponse] = await Promise.all([
                    api.get('/auth/me'), // Fetches current user's data
                    api.get('/notes')    // Fetches notes for the current user
                ]);
                setUser(userResponse.data);
                setNotes(notesResponse.data);
            } catch (err) {
                setError('Failed to fetch data. You may have been logged out.');
                // If there's an error (e.g., invalid token), log the user out
                localStorage.removeItem('token');
                navigate('/signin');
            } finally {
                setLoading(false);
            }
        };
        
        // --- Google OAuth Token Handling ---
        // Check for a token in the URL query parameters first.
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl) {
            // If a token is found, save it to localStorage.
            localStorage.setItem('token', tokenFromUrl);
            // Clean the URL by removing the token for a better user experience.
            window.history.replaceState(null, '', location.pathname);
        }

        const existingToken = localStorage.getItem('token');
        if (existingToken) {
            fetchData();
        } else {
            // If no token exists anywhere, redirect to sign-in
            navigate('/signin');
        }
    }, [navigate, location]);

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return; // Don't create empty notes

        try {
            const res = await api.post('/notes', { content: newNote });
            // Add the new note to the top of the list for better UX
            setNotes([res.data, ...notes]);
            setNewNote('');
        } catch (error) {
            setError('Failed to create the note. Please try again.');
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (error) {
            setError('Failed to delete the note. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {user?.name || 'User'}!
                    </h1>
                    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 !w-auto">
                        Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                {error && <p className="text-red-500 bg-red-100 p-3 mb-4 rounded">{error}</p>}

                {/* Note Creation Form */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <form onSubmit={handleCreateNote}>
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Create a new note</h2>
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="mt-4 text-right">
                             <Button type="submit" className="!w-auto">Add Note</Button>
                        </div>
                    </form>
                </div>

                {/* Notes List */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Notes</h2>
                    {notes.length > 0 ? (
                        <div className="space-y-4">
                            {notes.map(note => (
                                <div key={note._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                                    <p className="text-gray-800 whitespace-pre-wrap flex-1">{note.content}</p>
                                    <button onClick={() => handleDeleteNote(note._id)} className="text-gray-400 hover:text-red-500 ml-4 p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                            You haven't created any notes yet.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;