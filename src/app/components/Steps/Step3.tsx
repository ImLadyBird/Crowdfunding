import Image from "next/image";

export default function Step3() {
    return(
        <div className="flex flex-col gap-9 justify-center items-center">
            <h1 className="text-3xl text-[#644FC1] mt-10">Congratulation!!</h1>
            <Image src="/ele.svg" alt="logo" width={507.7} height={324} priority />
            <div className="flex flex-col gap-4 justify-center items-center">
                <h2 className="font-bold  text-gray-700 mt-2">
                Your Creative starter has been approved by our experts!
            </h2>
            <span className="font-light text-neutral-500 text-sm">
                Welcome abroad! Lets dive in and get started.
            </span>
            <button className="bg-[#644FC1] text-white rounded-[5px] px-4 py-2 font-light text-sm hover:bg-gray-400 cursor-pointer">
                Go to my profile
            </button>
            </div>
        </div>
    )
}