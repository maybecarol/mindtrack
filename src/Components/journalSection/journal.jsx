import React, { useState } from 'react';
import './journal.css'; // Import the CSS file
import Navbar from '../navbar';

const Journal = () => {
    const [diaryTitle, setDiaryTitle] = useState(''); // State for the diary title
    const [diaryEntry, setDiaryEntry] = useState(''); // State for the diary content
    const [entries, setEntries] = useState([]); // State for the list of entries
    const [editIndex, setEditIndex] = useState(null); // State to track which entry is being edited
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [selectedEntry, setSelectedEntry] = useState({ title: '', content: '' }); // State to store the selected entry for the modal

    const handleSaveEntry = () => {
        if (diaryTitle) { // Check if the title is provided
            const newEntry = {
                title: diaryTitle || 'Untitled', // Use 'Untitled' if no title is provided
                content: diaryEntry, // Allow empty content
                date: new Date().toLocaleString() // Format the date and time
            };

            if (editIndex !== null) {
                // Update existing entry
                const updatedEntries = entries.map((entry, index) =>
                    index === editIndex ? newEntry : entry
                );
                setEntries(updatedEntries);
                setEditIndex(null); // Reset edit index after updating
            } else {
                // Add new entry at the start
                setEntries([newEntry, ...entries]);
            }

            setDiaryTitle(''); // Clear the title input after saving
            setDiaryEntry(''); // Clear the content after saving
        }
    };

    const handleDeleteEntry = (index) => {
        const updatedEntries = entries.filter((_, i) => i !== index); // Filter out the entry to delete
        setEntries(updatedEntries); // Update the entries state
    };

    const handleEditEntry = (index) => {
        const entryToEdit = entries[index];
        setDiaryTitle(entryToEdit.title); // Set title to be edited
        setDiaryEntry(entryToEdit.content); // Set content to be edited
        setEditIndex(index); // Set the index of the entry being edited
    };

    const handleTitleClick = (entry) => {
        setSelectedEntry(entry); // Set the selected entry for the modal
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <>
            <Navbar />
            <section className="journal">
                <h1>My Diary</h1>
                <input
                    type="text"
                    id="journal-title"
                    placeholder="Entry Title"
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                />
                <textarea
                    id="jornal-diaryEntry"
                    placeholder="Write your thoughts here..."
                    value={diaryEntry}
                    onChange={(e) => setDiaryEntry(e.target.value)}
                />
                <button id="journal-saveEntry" onClick={handleSaveEntry}>
                    {editIndex !== null ? 'Update Entry' : 'Save Entry'}
                </button>
                <hr />
                <h2>Saved Entries</h2>
                <ul id="journal-entriesList">
                    {entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, index) => (
                        <li key={index}>
                            <strong
                                onClick={() => handleTitleClick(entry)}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {entry.title || 'Untitled'}
                            </strong>
                            <em>({entry.date})</em>
                            {/* Removed description (content) from the saved entries */}
                            <div>
                                <button onClick={() => handleEditEntry(index)} className="edit-button">Edit</button>
                                <button onClick={() => handleDeleteEntry(index)} className="delete-button">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
                {isModalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{selectedEntry.title || 'Untitled'}</h2>
                            <p>{selectedEntry.content}</p>
                            <button className="close-button" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default Journal;
