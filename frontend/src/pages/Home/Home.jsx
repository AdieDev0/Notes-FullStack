import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdOutlineAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

// Set app element for accessibility
Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null); // Store user info
  const navigate = useNavigate();

  // GET USER INFO
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Update state with user info
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Handle unauthorized access
          localStorage.clear(); // Clear localStorage
          navigate("/login"); // Redirect to login
        } else {
          console.error("API Error:", error.response.data); // Log other API errors
        }
      } else {
        console.error("Network or unexpected error:", error.message); // Handle network errors
      }
    }
  };

  useEffect(() => {
    getUserInfo(); // Fetch user info on component mount
  }, []); // Run only once on mount

  const customModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Replace NoteCard with dynamic data when ready */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NoteCard
            title="Meeting on 21st December"
            date="2nd Dec 2024"
            content="Meeting on 21st December Meeting on 21st December"
            tags="#Meeting"
            isPinned={true}
            onEdit={() => console.log("Edit Note clicked")}
            onDelete={() => console.log("Delete Note clicked")}
            onPinNote={() => console.log("Pin Note clicked")}
          />
        </div>
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

      {/* Modal Component */}
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
        <div
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
          onClick={() =>
            setOpenAddEditModal((prev) => ({ ...prev, isShown: false }))
          }
        >
          &times;
        </div>

        {/* Add/Edit Notes Component */}
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
        />
      </Modal>
    </>
  );
};

export default Home;
