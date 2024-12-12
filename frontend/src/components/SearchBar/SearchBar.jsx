import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 h-10 flex items-center px-4 rounded-md border border-black">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs py-1 text-black placeholder-black/60 outline-none"
        value={value}
        onChange={onChange}
        aria-label="Search notes"
      />

      {value && (
        <IoClose
          onClick={onClearSearch}
          className="text-xl text-black/60 cursor-pointer hover:text-black mr-3"
        />
      )}
      <HiMiniMagnifyingGlass
        onClick={handleSearch}
        className=" cursor-pointer text-black/60 hover:text-black "
      />
    </div>
  );
};

export default SearchBar;
