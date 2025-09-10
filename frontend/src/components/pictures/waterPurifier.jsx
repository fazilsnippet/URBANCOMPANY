import React from "react";
import ResponsiveImageCard from "../imageCard";

const WaterPurifier = () => {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveImageCard
        smallImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752250041850-2b0ff6.jpeg"
        largeImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752250021683-1b1754.jpeg"
        altText="Demo Product"
        route="#"
      />
    </div>
  );
};

export default WaterPurifier;