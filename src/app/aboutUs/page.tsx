"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Hero Section */}
      <div className="bg-gradient-to-r from-[#4B2EFF] to-[#7A5CFA] text-white py-20 rounded-b-[40px] shadow-md">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Empowering innovators and creators through community and technology.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto mt-16 mb-24 bg-white rounded-3xl shadow-md px-8 md:px-16 py-12">
        {/* Mission Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#270F94] mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our mission is to provide a platform where innovators, creators, and changemakers can 
            showcase their vision, connect with communities, and access opportunities that help 
            transform ideas into impact.
          </p>
        </section>

        {/* Vision Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#270F94] mb-4">Our Vision</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We envision a world where technology, creativity, and collaboration drive positive change. 
            Through inclusive tools and resources, we aim to make innovation accessible to everyone.
          </p>
        </section>

        {/* Team Section */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-semibold text-[#270F94] mb-10">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { name: "Jane Doe", role: "CEO & Founder", img: "/user.png" },
              { name: "Alex Carter", role: "Head of Design", img: "/user.png" },
              { name: "Sam Rivera", role: "Tech Lead", img: "/user.png" },
            ].map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition w-64"
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
                <h3 className="text-lg font-semibold text-[#644FC1]">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
