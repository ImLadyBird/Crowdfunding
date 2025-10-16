import React from "react";

const ProfileHeader: React.FC = () => {
  return (
    <header className="flex flex-row justify-start bg-linear-to-r from-gray-400 via-blue-400 to-gray-400  text-white relative overflow-hidden h-[427px] mx-5 rounded-2xl">
      <div className="absolute top-4 right-4">
        <button className="text-purple-400 text-sm mr-4">Edit cover</button>
      </div>
      <div className="absolute bottom-4 left-4 flex items-end">
        <div className="bg-purple-600 text-white px-3 py-2 rounded mr-4">
          Edit profile
        </div>
        <div className="text-gray-400 text-sm">•••</div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button className="bg-purple-600 text-white px-3 py-1 rounded">
          Settings
        </button>
      </div>
      <div className=" inset-0 flex items-center px-[71.5px] justify-center">
        <h1 className="text-4xl font-bold text-white">Brand or Organization</h1>
      </div>
      <div className="absolute bottom-4 left-32 text-xl font-semibold text-purple-400">
        Wish Work
      </div>
      <div className="absolute bottom-4 right-32 text-sm text-gray-400">
        000S Total contribution
      </div>
      
      <div className="absolute top-1/2 left-10 transform -translate-y-1/2 w-20 h-20 bg-gray-500 opacity-50 rounded-full"></div>
    </header>
  );
};

export default ProfileHeader;
