"use client";

import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { FiX } from "react-icons/fi";
import { Note } from "./Notes";

type AddNoteDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onAddNote?: (note: Note) => void;
  setallNotes: Dispatch<SetStateAction<Note[]>>;
};

export default function AddNote({
  isOpen,
  setIsOpen,
  onAddNote,
  setallNotes,
}: AddNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/notes",
        { title, content },
        { withCredentials: true }
      );
      if (res.status == 200) {
        setallNotes((prev) => [...prev, res.data.note]);
        setIsOpen(false);
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg animate-in fade-in zoom-in-95"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-700">Add Note</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full border text-black p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Content..."
              rows={5}
              className="w-full border text-black p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
            >
              Add Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
