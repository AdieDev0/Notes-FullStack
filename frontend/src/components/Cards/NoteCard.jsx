import React from "react";
import { BsPin } from "react-icons/bs";
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { GiPin } from "react-icons/gi";
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
    <div className="border border-black/50 rounded-lg p-4 sm:p-3 md:p-5 lg:p-8 bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl transition-transform transform hover:scale-105 ease-in-out">
      <div className="flex md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h6 className="text-base font-semibold font-Parkinsans text-black">
            {title}
          </h6>
          <span className="text-sm text-gray-500 font-Parkinsans">
            {moment(date).format("MMM DD, YYYY")}
          </span>
        </div>
        <div>
          {isPinned ? (
            <GiPin
              className="text-xl cursor-pointer transition-colors text-black hover:text-gray-700"
              onClick={onPinNote}
            />
          ) : (
            <BsPin
              className="text-xl cursor-pointer transition-colors text-gray-400 hover:text-black"
              onClick={onPinNote}
            />
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-3 leading-relaxed">
        {content?.slice(0, 60)}...
      </p>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4">
        <div className="text-sm font-medium text-blue-500">
          {tags.map((item, index) => (
            <span key={index}>#{item} </span>
          ))}
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <IoCreateOutline
            className="text-xl text-gray-400 cursor-pointer hover:text-black transition-colors"
            onClick={onEdit}
          />
          <MdDeleteOutline
            className="text-xl text-gray-400 cursor-pointer hover:text-black transition-colors"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
