import React from "react";
import ResponsiveImageCard from "../imageCard";

const WallPanel = () => {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveImageCard
        smallImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752250448387-7794be.jpeg"
        largeImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1736922795409-bece35.jpeg"
        altText="Demo Product"
        route="#"
      />
    </div>
  );
};

export default WallPanel;
