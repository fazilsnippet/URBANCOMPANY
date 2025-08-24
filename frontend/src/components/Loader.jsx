import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center">
      <span className="inline-block w-[3px] h-5 bg-white/50 rounded-[10px] animate-[scale-up_1s_linear_infinite]"></span>
      <span className="inline-block w-[3px] h-[35px] mx-[5px] bg-white/50 rounded-[10px] animate-[scale-up_1s_linear_infinite] [animation-delay:0.25s]"></span>
      <span className="inline-block w-[3px] h-5 bg-white/50 rounded-[10px] animate-[scale-up_1s_linear_infinite] [animation-delay:0.5s]"></span>

      {/* custom keyframes */}
      <style>
        {`
          @keyframes scale-up {
            20% {
              background-color: #fff;
              transform: scaleY(1.5);
            }
            40% {
              transform: scaleY(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;