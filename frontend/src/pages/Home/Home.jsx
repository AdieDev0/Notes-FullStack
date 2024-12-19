import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { debounce } from "lodash";

Modal.setAppElement("#root");

// Animation variants for different components
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const noteVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
      type: "spring",
      stiffness: 400
    }
  },
  tap: {
    scale: 0.95
  }
};

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleDelete = async (noteId) => {
    try {
      await axiosInstance.delete(`/delete-note/${noteId}`);
      toast.success("Note successfully deleted!");
      setAllNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== noteId)
      );
    } catch (error) {
      console.error("Error deleting note:", error.message);
      toast.error("Failed to delete the note. Please try again.");
    }
  };

  const updateIsPinned = async (noteId, currentPinnedState) => {
    try {
      const response = await axiosInstance.put(
        `/update-note-pinned/${noteId}`,
        {
          isPinned: !currentPinnedState,
        }
      );

      if (response.data && response.data.note) {
        setAllNotes(
          (prevNotes) =>
            prevNotes
              .map((note) =>
                note._id === noteId
                  ? { ...note, isPinned: !currentPinnedState }
                  : note
              )
              .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
        );
        toast.success(
          currentPinnedState
            ? "Note successfully unpinned!"
            : "Note successfully pinned!"
        );
      }
    } catch (error) {
      console.error("Error updating pin status:", error.message);
      toast.error("Failed to update pin status. Please try again.");
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("API Error:", error.response?.data || error.message);
        toast.error("Failed to fetch user info.");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data?.notes) {
        setAllNotes(
          response.data.notes.sort(
            (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
          )
        );
        setNoResultsFound(false);
      }
    } catch (error) {
      console.error("Error fetching notes:", error.message);
      toast.error("Failed to fetch notes.");
    }
  };

  const onSearchNote = debounce(async (query) => {
    if (!query || query.trim() === "") {
      return;
    }

    try {
      const response = await axiosInstance.get("/search-note", {
        params: { query },
      });

      if (response.data && response.data.notes.length > 0) {
        setIsSearch(true);
        setNoResultsFound(false);
        setAllNotes(
          response.data.notes.sort(
            (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
          )
        );
      } else {
        setIsSearch(true);
        setNoResultsFound(true);
        setAllNotes([]);
      }
    } catch (error) {
      console.error(
        "Error fetching search results:",
        error.response?.data?.message || error.message
      );
    }
  }, 300);

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  const customModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} />
      <motion.div 
        className="container mx-auto px-10 py-6"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <AnimatePresence mode="wait">
          {noResultsFound ? (
            <motion.div
              key="empty-search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyCard
                animation={AddNotesSvg}
                message="No matching notes found. Try searching with different keywords."
              />
            </motion.div>
          ) : allNotes.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              <AnimatePresence>
                {allNotes.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={noteVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                  >
                    <NoteCard
                      title={item.title}
                      date={moment(item.date).format("MMM DD, YYYY")}
                      content={item.content}
                      tags={item.tags}
                      isPinned={item.isPinned}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item._id)}
                      onPinNote={() => updateIsPinned(item._id, item.isPinned)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty-notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyCard
                animation={AddNotesSvg}
                message="Start creating your first note! Click the 'Add' button to note down your thoughts, ideas, and reminders. Let's get started!"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        className="w-16 h-16 flex items-center justify-center bg-black fixed right-6 bottom-6 rounded-full shadow-2xl"
        aria-label="Add Note"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <MdOutlineAdd className="text-4xl text-white" />
      </motion.button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal((prev) => ({ ...prev, isShown: false }))
        }
        style={customModalStyles}
        contentLabel={
          openAddEditModal.type === "add" ? "Add Note" : "Edit Note"
        }
        className="w-full max-w-lg rounded-lg mx-auto mt-24 p-6 shadow-lg outline-none relative"
      >
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