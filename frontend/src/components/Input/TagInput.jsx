import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-full shadow-sm"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="flex items-center justify-center text-red-500 hover:text-red-700"
                aria-label={`Remove tag ${tag}`}
              >
                <MdClose />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          placeholder="Add a tag"
          className="flex-grow text-sm bg-transparent border border-gray-300 px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Enter a tag and press Enter"
        />
        <button
          onClick={addNewTag}
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          aria-label="Add Tag"
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
