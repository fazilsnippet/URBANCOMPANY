import React from "react";
import ResponsiveImageCard from "../imageCard";

const Sofa = () => {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveImageCard
        smallImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_3,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1754587811385-54e98e.jpeg"
        largeImage="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1735893886310-6dbc53.jpeg"
        altText="Demo Product"
        route="#"
      />
    </div>
  );
};

export default Sofa;