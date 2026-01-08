"use client";

import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { Note } from "./Notes";

type NoteDialogProps = {
  isOverview: boolean;
  note: Note | null;
  setisOverview: Dispatch<SetStateAction<boolean>>;
  setallNotes: Dispatch<SetStateAction<Note[]>>;
  allNotes: Note[];
};

export default function NoteOverview({
  isOverview,
  note,
  setisOverview,
  setallNotes,
  allNotes,
}: NoteDialogProps) {
  const [isEditing, setisEditing] = useState(false);
  const [editedContent, seteditedContent] = useState<string | undefined>(
    note?.content
  );

  if (!isOverview || !note) return null;

  const handleEditedNote = async () => {
    try {
      const res = await axios.patch(
        "/api/notes",
        { ...note, content: editedContent },
        { withCredentials: true }
      );
      setallNotes((prev) =>
        prev.map((e) => (e._id === res.data.note._id ? res.data.note : e))
      );
      setisEditing(false);
      setisOverview(false);
    } catch (error: any) {
      // alert(error.response.data);
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="
            bg-white w-full max-w-lg rounded-xl shadow-lg p-6
            animate-in fade-in zoom-in-95
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-purple-700">
              {note.title}
            </h2>

            <div className="flex gap-3">
              {isEditing && (
                <button
                  onClick={handleEditedNote}
                  className="bg-green-400 px-3 py-1.5 rounded-xl hover:opacity-50 cursor-pointer"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => setisEditing(true)}
                className="text-gray-500 cursor-pointer  hover:text-gray-700"
              >
                <MdEdit className="text-2xl text-red-500" />
              </button>
              <button
                onClick={() => setisOverview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            {new Date(note.createdAt).toLocaleDateString()}
          </p>

          {isEditing ? (
            <textarea
              defaultValue={note.content}
              onChange={(e) => {
                seteditedContent(e.target.value);
              }}
              className="w-full border-none outline-none text-black"
            ></textarea>
          ) : (
            <div className="text-gray-700 whitespace-pre-line">
              {note.content}
            </div>
          )}
        </div>
      </div>
      <button className="text-black">save</button>
    </div>
  );
}
