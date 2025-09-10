import React from "react";

const Loader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-neutral-900">
      <div
        className="
          relative inline-block w-[60px] h-[40px] bg-neutral-900
          before:content-[''] before:absolute before:left-0 before:top-0
          before:w-[36px] before:h-[36px] before:rounded-full before:bg-gray-200
          before:animate-[rotationBack_3s_linear_infinite]

          after:content-[''] after:absolute after:left-[35px] after:top-[15px]
          after:w-[24px] after:h-[24px] after:rounded-full after:bg-gray-200
          after:animate-[rotationBack_4s_linear_infinite_reverse]
        "
      />

      {/* Inline keyframes for rotation */}
      <style>{`
        @keyframes rotationBack {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
