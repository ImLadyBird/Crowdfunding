interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

function BackButton({button , text, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className=" text-[#644FC1]  absolute top-5 md:left-20 left-5  font-bold text-4xl  cursor-pointer hover:text-gray-500"
    >
      {text}
    </button>
  );
}
export default BackButton;
