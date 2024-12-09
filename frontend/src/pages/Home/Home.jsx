import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdOutlineAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmptyCard from "../../components/EmptyCards/EmptyCard";
import AddNotesSvg from "../../assets/man-holding-note.json";

// Set Modal's app element for accessibility
Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null); // Store user info
  const [allNotes, setAllNotes] = useState([]); // Store notes
  const navigate = useNavigate();

  // SEARCH
  const [isSearch, setIsSearch] = useState(false);

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // DELETE NOTE
  const handleDelete = async (noteId) => {
    try {
      await axiosInstance.delete(`/delete-note/${noteId}`);
      toast.success("Note successfully deleted!"); // Show success toast
      setAllNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== noteId)
      ); // Update UI
    } catch (error) {
      console.error("Error deleting note:", error.message);
      toast.error("Failed to delete the note. Please try again."); // Show error toast
    }
  };

  // PIN NOTE
  const handlePin = async (noteId) => {
    try {
      await axiosInstance.put(`/pin-note/${noteId}`);
      toast.success("Note pinned successfully!");
      getAllNotes(); // Refresh notes list
    } catch (error) {
      console.error("Error pinning note:", error.message);
      toast.error("Failed to pin the note. Please try again.");
    }
  };

  // Fetch user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear(); // Clear local storage
        navigate("/login"); // Redirect to login
      } else {
        console.error("API Error:", error.response?.data || error.message);
        toast.error("Failed to fetch user info.");
      }
    }
  };

  // Fetch all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data?.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error.message);
      toast.error("Failed to fetch notes.");
    }
  };

  // Search for a note
  const onSearchNote = async (query) => {
    if (!query || query.trim() === "") {
      console.warn("Search query is required and cannot be empty.");
      return;
    }
  
    try {
      const response = await axiosInstance.get("/search-note", {
        params: { query },
      });
  
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      } else {
        setIsSearch(false);
        setAllNotes([]);
        console.warn("No matching notes found.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error.response?.data?.message || error.message);
    }
  };
  
  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);
  

  // Modal styles
  const customModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote}/>

      {/* Notes List */}
      <div className="container mx-auto px-4 py-6">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={moment(item.date, "MMM DD, YYYY").format("MMM DD, YYYY")}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item._id)}
                onPinNote={() => handlePin(item._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            animation={AddNotesSvg} // Pass Lottie animation data here
            message={`Start creating your first note! Click the 'Add' button to note down your thoughts, ideas, and reminders. Let's get started!`}
          />
        )}
      </div>

      {/* Floating Action Button */}
      <button
        className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 fixed right-6 bottom-6 rounded-full shadow-2xl transition-transform transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Add Note"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdOutlineAdd className="text-4xl text-white" />
      </button>

      {/* Modal for Adding/Editing Notes */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal((prev) => ({ ...prev, isShown: false }))
        }
        style={customModalStyles}
        contentLabel={
          openAddEditModal.type === "add" ? "Add Note" : "Edit Note"
        }
        className="w-full max-w-lg bg-white rounded-lg mx-auto mt-24 p-6 shadow-lg outline-none relative"
      >
        {/* Close Modal Button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
          onClick={() =>
            setOpenAddEditModal((prev) => ({ ...prev, isShown: false }))
          }
        >
          &times;
        </button>

        {/* Add/Edit Notes Component */}
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
        />
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Home;
