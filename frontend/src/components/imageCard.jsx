import React from "react";
import { Link } from "react-router-dom";

const ResponsiveImageCard = ({ smallImage, largeImage, altText, route }) => {
  return (
    <div className="mt-4 mb-4">
      <Link to={route}>
        <div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-101">
          <picture>
            <source media="(min-width: 768px)" srcSet={largeImage} />
            <img
              src={smallImage}
              alt={altText}
              className="w-full h-auto object-cover"
            />
          </picture>
        </div>
      </Link>
    </div>
  );
};
export default ResponsiveImageCard;
