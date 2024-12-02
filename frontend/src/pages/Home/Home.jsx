import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdOutlineAdd } from "react-icons/md";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <NoteCard
            title="Meeting on 21st December"
            date="2nd Dec 2024"
            content="Meeting on 21st December Meeting on 21st December"
            tags="#Meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
        <button
          className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 fixed right-6 bottom-6 rounded-full shadow-xl transition-transform transform hover:scale-105"
          aria-label="Add Note"
        >
          <MdOutlineAdd className="text-4xl text-white" />
        </button>
      </div>
    </>
  );
};

export default Home;
