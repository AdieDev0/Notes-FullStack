import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ noteData, type, onClose }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Placeholder functions for adding and editing notes
  const addNewNote = async () => {
    console.log("New note added:", { title, content, tags });
  };

  const editNote = async () => {
    console.log("Note edited:", { title, content, tags });
  };

  const handleAddNote = () => {
    setError("");

    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }

    onClose(); // Close the modal after action
  };

  return (
    <div className="p-4 relative">
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        aria-label="Close Modal"
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="note-title"
          className="text-sm font-semibold text-gray-600 tracking-wide"
        >
          TITLE
        </label>
        <input
          id="note-title"
          type="text"
          className="text-xl text-gray-800 outline-none bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="note-content"
          className="text-sm font-semibold text-gray-600 tracking-wide"
        >
          CONTENT
        </label>
        <textarea
          id="note-content"
          className="text-sm text-gray-800 outline-none bg-gray-50 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="note-tags"
          className="text-sm font-semibold text-gray-600 tracking-wide"
        >
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        aria-label={type === "edit" ? "Edit Note" : "Add Note"}
        className="w-full bg-blue-500 text-white font-medium text-sm py-3 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
        onClick={handleAddNote}
      >
        {type === "edit" ? "EDIT" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
