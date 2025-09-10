import React from "react";
import ResponsiveImageCard from "../imageCard";

const Locker = () => {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveImageCard
        smallImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752250448387-7794be.jpeg"
        largeImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752250436156-db21b3.jpeg"
        altText="Demo Product"
        route="#"
      />
    </div>
  );
};

export default Locker;
