import React from "react";
import { FaDiscord, FaYoutube } from "react-icons/fa";

export default function ProfileUpdateSection() {
  return (
    <section className="p-6 md:px-40 bg-white">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
       <span className="h-3 w-3 rounded-full bg-violet-800" /> UPDATES
      </h2>

      <div className="flex flex-col gap-6">
        {/* Update Card 1 */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-violet-900 rounded-lg" />
              <div>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Amirhossein Shirani</span>{" "}
                  published a new update on{" "}
                  <span className="font-semibold">Discord</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-violet-900">10 July 2024</p>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>

          <div className="mt-3">
            <button className="flex items-center gap-2 text-sm px-3 py-1 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition">
              <FaDiscord className="text-violet-900" /> Discord
            </button>
          </div>
        </div>

        {/* Update Card 2 */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-violet-900 rounded-lg" />
              <div>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Amirhossein Shirani</span>{" "}
                  published a new update on{" "}
                  <span className="font-semibold">YouTube</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-violet-900">10 May 2024</p>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <div className="mt-3">
            <button className="flex items-center gap-2 text-sm px-3 py-1 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition">
              <FaYoutube className="text-violet-900" /> YouTube
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button className="text-sm border border-violet-900 text-violet-900 rounded-lg px-4 py-2 hover:bg-purple-50 transition">
          View all
        </button>
      </div>
    </section>
  );
}
