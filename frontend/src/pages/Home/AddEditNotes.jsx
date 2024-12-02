import React from "react";

const AddEditNotes = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-2 mb-6">
        <label className="text-sm font-semibold text-gray-600 tracking-wide">TITLE</label>
        <input
          type="text"
          className="text-xl text-gray-800 outline-none bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          placeholder="Go To Gym At 5"
        />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-sm font-semibold text-gray-600 tracking-wide">CONTENT</label>
        <textarea
          className="text-sm text-gray-800 outline-none bg-gray-50 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          placeholder="Content"
          rows={10}
        ></textarea>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-sm font-semibold text-gray-600 tracking-wide">TAGS</label>
        <input
          type="text"
          className="text-sm text-gray-800 outline-none bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          placeholder="#Tag"
        />
      </div>

      <button
        className="w-full bg-blue-500 text-white font-medium text-sm py-3 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
        onClick={() => {}}
      >
        ADD
      </button>
    </div>
  );
};

export default AddEditNotes;
