import React from "react";
import { Link } from "react-router-dom";

const BaseServiceCard = ({ image, title, description, rating, reviews, stars, route }) => {
  return (
    <div className="carousel-item w-64 flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden scroll-snap-align-start transition-transform duration-300 hover:-translate-y-1 b-gray-300 hover:border-gray-400">
      <div className="h-40 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <div className="flex items-center mt-3">
          <div className="flex text-amber-400">
            {Array.from({ length: Math.floor(stars) }).map((_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
            {stars % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
          </div>
          <span className="ml-2 text-sm text-gray-700">
            {rating} ({reviews})
          </span>
        </div>
        {/* 👇 Button navigates using the passed route prop */}
        <Link
          to={route}
          className="inline-block mt-4 px-4 py-2 bg-[#1a1a1a] text-[#ffd100] hover:text-white text-sm font-medium rounded-lg shadow transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};



export default BaseServiceCard;
