import React, { useState, useCallback } from "react";
import PropTypes from "prop-types"; // For prop type validation
import ProfileInfo from "../Cards/ProfileInfo";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import _ from "lodash"; // Import lodash for debouncing
import Lottie from "lottie-react";
import Notes from "../../assets/Notes.json";

const Navbar = ({ userInfo = {}, onSearchNote }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Debounced search function to improve performance
  const debouncedSearch = useCallback(
    _.debounce((query) => {
      if (query.trim()) {
        onSearchNote(query);
      }
    }, 300),
    [onSearchNote]
  );

  // Search input change handler
  const handleSearchInputChange = ({ target }) => {
    setSearchQuery(target.value);
    debouncedSearch(target.value);
  };

  // Clear search input
  const clearSearchInput = () => {
    setSearchQuery("");
    onSearchNote(""); // Reset search results
  };

  return (
    <>
      {/* LARGE SCREEN */}
      <div className="bg-white hidden md:flex flex-col md:flex-row items-center justify-between px-7 sm:px-12 py-4 shadow-md z-50 sticky top-0">
        {/* App Name */}
        <div className="flex items-center">
          <Lottie
            animationData={Notes}
            loop={true}
            className="size-20 cursor-pointer"
          />
          <h2 className="font-Parkinsans font-bold text-2xl text-black cursor-pointer">
            OpenNotes
          </h2>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-auto mt-3 sm:mt-0 flex-1 sm:flex-none sm:px-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchInputChange}
            handleSearch={() => debouncedSearch(searchQuery)}
            onClearSearch={clearSearchInput}
          />
        </div>

        {/* Profile Information */}
        <div className="mt-3 sm:mt-0">
          <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
        </div>
      </div>

      {/* MOBILE SCREEN */}
      <div className="bg-white items-center justify-between shadow-md z-50 sticky top-0 lg:hidden p-4">
        <div className="flex items-center justify-between">
          {/* App Name */}
          <div className="flex items-center">
            <Lottie
              animationData={Notes}
              loop={true}
              className="size-14 cursor-pointer"
            />
            <h2 className="font-Parkinsans font-bold text-lg md:text-2xl text-black cursor-pointer">
              OpenNotes
            </h2>
          </div>

          {/* Profile Information */}
          <div className="mt-2 sm:mt-0">
            <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full mt-3 flex-1 sm:flex-none sm:px-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchInputChange}
            handleSearch={() => debouncedSearch(searchQuery)}
            onClearSearch={clearSearchInput}
          />
        </div>
      </div>
    </>
  );
};

// Prop Types for validation
Navbar.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onSearchNote: PropTypes.func.isRequired,
};

export default Navbar;
