import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEditNotes = ({ noteData, type, onClose, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // ADD NOTE
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        getAllNotes(); // Refresh notes
        onClose(); // Close the modal
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // EDIT NOTE
  const editNote = async () => {
    try {
      const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        getAllNotes(); // Refresh notes
        onClose(); // Close the modal
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Handle Add/Edit Note Action
  const handleAddNote = () => {
    setError(""); // Reset error message

    if (!title.trim()) {
      setError("Please enter the title.");
      toast.error("Title is required!"); // Display an error toast
      return;
    }

    if (!content.trim()) {
      setError("Please enter the content.");
      toast.error("Content is required!"); // Display an error toast
      return;
    }

    if (type === "edit") {
      editNote();
      toast.success("Note successfully edited!"); // Success toast for edit
    } else {
      addNewNote();
      toast.success("Note successfully added!"); // Success toast for add
    }
  };

  return (
    <div className="relative bg-black text-black rounded-lg p-4 sm:p-8 lg:p-6 mt-16 md:mt-0 lg:mt-0">
      {/* Close Modal Button */}
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-4 -right-4 bg-black text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
        aria-label="Close Modal"
      >
        <MdClose className="text-xl" />
      </button>

      {/* Title Input */}
      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="note-title"
          className="text-sm font-Parkinsans font-semibold tracking-wide"
        >
          TITLE
        </label>
        <input
          id="note-title"
          type="text"
          className="text-lg text-black bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Content Input */}
      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="note-content"
          className="text-sm font-semibold font-Parkinsans tracking-wide"
        >
          CONTENT
        </label>
        <textarea
          id="note-content"
          className="text-sm text-black bg-gray-50 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
          placeholder="Write your content here..."
          rows={6}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      {/* Tags Input */}
      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="note-tags"
          className="text-sm font-semibold font-Parkinsans tracking-wide"
        >
          TAGS
        </label>
        <TagInput
          tags={tags}
          setTags={setTags}
          inputClass="bg-gray-50 border-gray-300 text-black"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      {/* Add/Edit Note Button */}
      <button
        aria-label={type === "edit" ? "Edit Note" : "Add Note"}
        className="w-full bg-black text-white font-Parkinsans font-medium text-sm py-3 rounded-md shadow-lg hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
        onClick={handleAddNote}
      >
        {type === "edit" ? "EDIT NOTE" : "ADD NOTE"}
      </button>
    </div>
  );
};

export default AddEditNotes;
