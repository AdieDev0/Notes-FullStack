import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 h-10 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-1 outline-none"
        value={value}
        onChange={onChange}
        aria-label="Search notes"
      />

      {value && (
        <IoClose
          onClick={onClearSearch}
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
        />
      )}
      <HiMiniMagnifyingGlass
        onClick={handleSearch}
        className="text-slate-400 cursor-pointer hover:text-black"
      />
    </div>
  );
};

export default SearchBar;
