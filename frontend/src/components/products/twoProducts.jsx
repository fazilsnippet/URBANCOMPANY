import React from "react";

const TwoMen = () => {
  return (
    <div className="flex flex-wrap p-1.5 mb-4 mt-4 ">
      {/* Product 1 */}
      <div className="w-full md:w-1/2 p-8">
        <div className="rounded-xl overflow-hidden shadow-md bg-white">
          <img
src="https://plus.unsplash.com/premium_photo-1661404037948-20b44f2c45c6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dummy Product 1"
className="w-full h-94 object-cover"          />
          
        </div>
      </div>

      {/* Product 2 */}
      <div className="w-full md:w-1/2 p-8">
        <div className="rounded-xl overflow-hidden shadow-md bg-white">
          <img 
src="https://media.istockphoto.com/id/997496666/photo/young-man-having-relaxing-head-massage-at-the-spa.jpg?s=1024x1024&w=is&k=20&c=8EZem9SdooJs9y8RghRL_LKNTHwAPdPyudQGAdUdjAs="
            alt="Dummy Product 2"
className="w-full h-94 object-cover"          />
         
        </div>
      </div>
    </div>
  );
};

export default TwoMen
