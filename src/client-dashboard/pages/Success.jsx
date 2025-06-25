import React from "react";
import { Link } from "react-router-dom";
import image from "../../assets/graphics/success.png";

const Success = () => {
  return (
    <div className="min-h-[] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="">
            <div className="flex items-center justify-center">
              <img src={image} alt="" className="h-[300px]" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          Your Payment is Successful
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. An automated payment receipt will be sent
          to your registered email.
        </p>
        <Link to="/client/wallet" className="text-primary underline">
          View In wallet
        </Link>
      </div>
    </div>
  );
};

export default Success;
