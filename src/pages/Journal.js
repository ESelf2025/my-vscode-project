import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";
import { getGuides } from "./getGuides";
import JournalIconBox from "./JournalIconBox";

function Journal() {
  const [entry, setEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);
  const [allGuides, setAllGuides] = useState([]);
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [mode, setMode] = useState(null); // "type" mode

  useEffect(() => {
    const fetchEntries = async () => {
      const snapshot = await getDocs(collection(db, "journalEntries"));
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setSavedEntries(data);
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    const fetchGuides = async () => {
      const data = await getGuides();
      setAllGuides(data);
    };
    fetchGuides();
  }, []);

  const handleSave = async () => {
    if (entry.trim() === "") return;

    const newEntry = {
      text: entry,
      emotion: entry.toUpperCase(),
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "journalEntries"), newEntry);
    setSavedEntries((prev) => [...prev, { ...newEntry, createdAt: new Date() }]);
    setEntry("");

    const match = allGuides.find((guide) =>
      guide.keyword && entry.toLowerCase().includes(guide.keyword.toLowerCase())
    );
    setMatchedGuide(match || null);
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "type" ? null : "type"));
  };

  return (
    <div className="journal-container">
      {/* Journal Icon */}
      <JournalIconBox toggleMode={toggleMode} />

      {/* Type Mode */}
      {mode === "type" && (
        <div className="journal-type-mode">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Type here like you're texting your diary..."
            className="journal-textarea"
          />

          <div className="journal-save-button-container">
            <button
              onClick={handleSave}
              className="journal-save-button"
            >
              💾 Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Journal;
