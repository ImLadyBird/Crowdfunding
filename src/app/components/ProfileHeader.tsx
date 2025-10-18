import React from "react";
import { Globe, Settings, Edit3, Instagram, MessageCircle } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-5 mx-auto">
        <div
          className="relative bg-gradient-to-br from-slate-400 via-slate-500 to-slate-400 rounded-3xl md:rounded-3xl"
          style={{ height: "240px" }}
        >
          <h1 className="absolute top-20 left-3 md:top-12 md:left-12 text-white text-3xl md:text-5xl font-bold">
            Brand or Organization
          </h1>

          <button className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 bg-violet-200 px-4 py-2 rounded-[7px] border-1 border-violet-900 transition-colors shadow-sm">
            <Edit3 className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-900">
              Edit cover
            </span>
          </button>

          <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 text-white text-right">
            <div className="text-sm md:text-base opacity-90">
              <span className="font-bold">000$</span> Total contribution
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 pb-8">
          <div className="hidden md:block">
            <div className="flex items-end justify-between -mt-20">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <div className="w-40 h-40 bg-violet-800 rounded-2xl shadow-xl" />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 rounded-2xl transition-colors group">
                    <span className="bg-white/20 text-white px-6 py-2 rounded-lg text-sm font-medium opacity-100">
                      Edit profile
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Globe className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Instagram className="w-5 h-5 text-gray-500" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <button className="flex items-center gap-2 px-4 py-2 border border-violet-800 rounded-[7px] bg-violet-100">
                  <Edit3 className="w-4 h-4 text-violet-800" />
                  <span className="text-sm font-medium text-violet-800">
                    Edit
                  </span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-violet-800 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Setting</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-3xl font-bold text-gray-900">Wish Work</h2>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden ">
            <div className="relative -mt-16 inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl" />
              <button className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 rounded-2xl transition-colors">
                <span className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                  Edit profile
                </span>
              </button>
            </div>

            <div className="mt-1">
              <h2 className="text-2xl font-bold text-gray-900">Wish Work</h2>
            </div>

            <div className="flex items-center justify-between gap-1 py-2">
             <div className="flex gap-2">
               <button className=" hover:bg-gray-100 rounded-full transition-colors">
                <Globe className="w-5 h-5 text-gray-500" />
              </button>
              <button className=" hover:bg-gray-100 rounded-full transition-colors">
                <MessageCircle className="w-5 h-5 text-gray-500" />
              </button>
              <button className=" hover:bg-gray-100 rounded-full transition-colors">
                <Instagram className="w-5 h-5 text-gray-500" />
              </button>
             </div>
              <div className="flex gap-2">
                <button className="p-2 bg-violet-800  rounded-full transition-colors shadow-lg ml-2">
                <Edit3 className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-violet-800  rounded-full transition-colors shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </button> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
