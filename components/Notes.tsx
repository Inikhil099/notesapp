"use client";

import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import NoteOverview from "./NoteOverview";
import AddNote from "./AddNote";
import axios from "axios";

export type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function Notes() {
  const [isOpen, setisOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isOverview, setisOverview] = useState(false);
  const [currentNote, setcurrentNote] = useState<Note | null>(null);
  const [allNotes, setallNotes] = useState<any>([]);

  const filteredNotes = allNotes.filter(
    (note: Note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteNote = async (note: Note) => {
    try {
      const res = await axios.delete(`/api/notes/${note._id}`, {
        data: { _id: note._id },
        withCredentials: true,
      });
      if (res.status == 200) {
        setallNotes((prev: Note[]) =>
          prev.filter((e: Note) => e._id! == note._id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getallnotes = async () => {
      try {
        const res = await axios.get("/api/notes", { withCredentials: true });
        if (res.status == 200) {
          setallNotes(res.data.notes);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getallnotes();
  }, []);

  return (
    <>
      <NoteOverview
        isOverview={isOverview}
        setisOverview={setisOverview}
        note={currentNote}
        setallNotes={setallNotes}
        allNotes={allNotes}

      />
      <AddNote
        setallNotes={setallNotes}
        isOpen={isOpen}
        setIsOpen={setisOpen}
      />
      <main className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-purple-800 mb-10">
            📝 Notes App
          </h1>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
            <div className="relative flex-1">
              <FiSearch className="absolute top-3.5 text-2xl left-3 text-purple-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 p-3 rounded-lg border-2 border-white text-black outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              onClick={() => setisOpen(true)}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg"
            >
              <FiPlus />
              Add Note
            </button>
          </div>

          {filteredNotes.length === 0 ? (
            <p className="text-center text-gray-500">No notes found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note: Note) => (
                <div
                  key={note._id}
                  className="bg-white flex flex-col justify-between p-5 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="">
                    <h3 className="text-lg font-semibold text-purple-700">
                      {note.title}
                    </h3>

                    <p className="text-gray-600 mt-2 line-clamp-4">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setcurrentNote(note);
                          setisOverview(true);
                        }}
                        className="text-blue-500 cursor-pointer text-sm"
                      >
                        Read Note
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note);
                        }}
                        title="Delete"
                        className="text-red-500 hover:text-red-600"
                      >
                        <FiTrash2 className="cursor-pointer text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
