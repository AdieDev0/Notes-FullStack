import React, { useState, useCallback } from "react";
import PropTypes from "prop-types"; // For prop type validation
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import _ from "lodash"; // Import lodash for debouncing

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
    <div className="bg-white flex flex-col sm:flex-row items-center justify-between px-6 py-2 shadow-md z-50 sticky top-0">
      {/* App Name */}
      <h2 className="font-Parkinsans font-bold text-xl text-black py-2 sm:py-0">
        OpenNotes
      </h2>

      {/* Search Bar */}
      <div className="w-full sm:w-auto mt-2 sm:mt-0">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchInputChange}
          handleSearch={() => debouncedSearch(searchQuery)}
          onClearSearch={clearSearchInput}
        />
      </div>

      {/* Profile Information */}
      <div className="mt-2 sm:mt-0">
        <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
      </div>
    </div>
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
