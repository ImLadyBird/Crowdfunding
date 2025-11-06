import Link from "next/link";

export default function ProfileGuideBar() {
  return (
    <div className="flex flex-row gap-5 overflow-hide whitespace-nowrap px-2 md:px-20 justify-around text-sm md:text-m border-b border-gray-400 bg-white">
      <Link
        href="#contribution"
        className="hidden md:block relative py-5 text-gray-700 transition-colors duration-300 ease-in-out hover:text-violet-900
             after:content-[''] after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-0 after:bg-violet-900
             after:transition-all after:duration-300 hover:after:w-full"
      >
        Contribution Tier
      </Link>
      <Link
        href="#about"
        className="relative py-5 text-gray-700 transition-colors duration-300 ease-in-out hover:text-violet-900
             after:content-[''] after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-0 after:bg-violet-900
             after:transition-all after:duration-300 hover:after:w-full"
      >
        About
      </Link>
      <Link
        href="#team"
        className="relative py-5 text-gray-700 transition-colors duration-300 ease-in-out hover:text-violet-900
             after:content-[''] after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-0 after:bg-violet-900
             after:transition-all after:duration-300 hover:after:w-full"
      >
        Team
      </Link>
      <Link
        href="#tops"
        className="relative py-5 text-gray-700 transition-colors duration-300 ease-in-out hover:text-violet-900
             after:content-[''] after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-0 after:bg-violet-900
             after:transition-all after:duration-300 hover:after:w-full"
      >
        Top Contributors
      </Link>
      <Link
        href="#faq"
        className="relative py-5 text-gray-700 transition-colors duration-300 ease-in-out hover:text-violet-900
             after:content-[''] after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-0 after:bg-violet-900
             after:transition-all after:duration-300 hover:after:w-full"
      >
        FAQ
      </Link>
      <Link
        href="#updates"
        className="relative py-5 text-gray-700 transition-colors duration-300 ease-in-out hover:text-violet-900
             after:content-[''] after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-0 after:bg-violet-900
             after:transition-all after:duration-300 hover:after:w-full"
      >
        Updates
      </Link>
    </div>
  );
}
