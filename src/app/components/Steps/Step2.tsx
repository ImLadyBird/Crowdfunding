import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { WizardContext } from "../../WizardForm/page";
import Button from "../Button";
function Step3() {
  const { nextStep } = useContext(WizardContext);

  const { register, handleSubmit } = useFormContext();

  function submitForm(data) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-4 justify-center p-9 items-center">
      <form onSubmit={handleSubmit(submitForm)}>
        <h1 className="text-3xl self-start text-[#644FC1] mt-10">
          Detailed Info
        </h1>
        <h2 className="font-bold self-start text-gray-700 mt-2">
          What is the primary mission or objective of your organization?
        </h2>
        <span className="font-light text-neutral-600 text-sm">
          Be more spicific and provide a detailed description of your
          organization.
        </span>
        <div className="py-9">
          <input
            {...register("details")}
            type="text"
            className="border-1 border-[#644FC1] rounded-[5px] w-full h-[200px]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold self-start text-gray-700 mt-2">
            Help your Contributors find you faster
          </h2>
          <span className="font-light text-neutral-600 text-sm">
            Connect your socials so the contributors get to know you better and
            find you faster
          </span>
          <input
            {...register("socilals")}
            type="text"
            className="border-1 border-[#644FC1] rounded-[5px] w-full"
          />
        </div>
        <div className="flex flex-row gap-4 justify-center p-9 items-center">
          <button
            type="submit"
            className="bg-[#644FC1] text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-400 cursor-pointer"
          >
            submit
          </button>
        </div>
      </form>
    </div>
  );
}
export default Step3;
