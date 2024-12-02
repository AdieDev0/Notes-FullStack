import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdOutlineAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";

// Set app element for accessibility
Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const customModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
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

      <button
        className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 fixed right-6 bottom-6 rounded-full shadow-2xl transition-transform transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Add Note"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdOutlineAdd className="text-4xl text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ ...openAddEditModal, isShown: false })
        }
        style={customModalStyles}
        contentLabel={
          openAddEditModal.type === "add" ? "Add Note" : "Edit Note"
        }
        className="w-full max-w-lg bg-white rounded-lg mx-auto mt-24 p-6 shadow-lg outline-none relative"
      >
        <div
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
          onClick={() =>
            setOpenAddEditModal({ ...openAddEditModal, isShown: false })
          }
        >
          &times;
        </div>
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
