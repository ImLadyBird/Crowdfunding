
export default function ProfileTopSection() {
  return (
    <div className="p-6 md:px-40 bg-white">
      <div className="flex items-center gap-2 py-6">
        <span className="h-3 w-3 rounded-full bg-violet-800" />
        <h2 className="text-xl font-semibold text-gray-800">
          Top Backers and Contributers
        </h2>
      </div>
      <div className="flex flex-row gap-6 justify-around items-center">
        <div className="flex flex-col gap-3 justify-start items-start">
          <h2 className="text-sm md:text-xl font-semibold">Individuals</h2>
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="w-[100px] h-[100px] border-4 border-violet-900 rounded-[20px] bg-gray-300"></div>
            <p>Nasim</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-start items-start">
          <h2 className="text-sm md:text-xl font-semibold">Brand ot Organization</h2>
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="w-[100px] h-[100px] border-4 border-violet-900 rounded-[20px] bg-gray-300"></div>
            <p>Kelaasor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
