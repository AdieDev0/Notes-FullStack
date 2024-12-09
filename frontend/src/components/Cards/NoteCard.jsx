import React from "react";
import { BsPin } from "react-icons/bs";
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl transition-transform transform hover:scale-105 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-base font-semibold text-gray-700">{title}</h6>
          <span className="text-sm text-gray-400">
            {moment(date).format("MMM DD, YYYY")}
          </span>
        </div>
        <BsPin
          className={`text-xl cursor-pointer transition-colors ${
            isPinned ? "text-blue-500" : "text-gray-300 hover:text-blue-400"
          }`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
        {content?.slice(0, 60)}...
      </p>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm font-medium text-blue-500">{tags}</div>

        <div className="flex space-x-4">
          <IoCreateOutline
            className="text-xl text-gray-400 cursor-pointer hover:text-green-500 transition-colors"
            onClick={onEdit}
          />
          <MdDeleteOutline
            className="text-xl text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
