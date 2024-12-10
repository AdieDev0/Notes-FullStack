import React from "react";
import Lottie from "lottie-react";

const EmptyCard = ({ imgSrc, animation, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      {animation ? (
        // Render Lottie animation if provided
        <Lottie animationData={animation} loop={true} className="w-60 h-60" />
      ) : (
        // Render static image if animation is not provided
        <img src={imgSrc} alt="No notes" className="w-60" />
      )}
      <p className="w-1/2 text-sm font-medium font-Parkinsans text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
