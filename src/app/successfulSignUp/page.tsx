import Image from "next/image";

export default function SuccessfulSignUp() {
  return (
    <div className="flex flex-col items-center justify-center p-10 gap-6    ">
      <h1 className="text-4xl font-semibold text-center mb-6 text-[#644FC1]">
        Welcome To 3F
      </h1>
      <Image src="/happy.svg" alt="happy" width={200} height={200} />
      <div className="flex flex-col items-center justify-center gap-0">
        <h2 className="text-2xl font-light text-center  text-gray-700">your journey begins here</h2>
        <h2 className="text-2xl font-light text-center mb-6 text-gray-700">are you ready?</h2>
      </div>
      <div className="flex flex-row gap-4 justify-center items-center">
        <button className="bg-[#644FC1] text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-400 cursor-pointer">Go Homepage</button>
        <button className="bg-[#644FC1] text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-400 cursor-pointer">Start Project</button>
      </div>
    </div>
  );
}
