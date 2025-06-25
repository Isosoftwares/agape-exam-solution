// Hero2.jsx
import React from "react";

const Hero2 = () => {
  return (
    <div className="bg-blue-600 text-white py-16 pt-[100px] min-h-[100vh] ">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-4 md:px-0">
        <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">
            Experience the triump and pride of achieving your GED, TEAS or HESI
            certifications
          </h1>
          <p className="text-gray-400 mb-8">
            Your key to new beginnings and endless possibilities{" "}
          </p>
          <button className="bg-primary text-black py-2 px-4 rounded-lg">
            Order Now
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img
            src="path-to-image.png"
            alt="Child eating pizza"
            className="rounded-full border-4 border-primary p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero2;
