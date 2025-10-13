interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

function Button({ text, ...props }: ButtonProps) {
  return <button {...props} className="bg-[#644FC1] text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-400 cursor-pointer">{text}</button>;
}
export default Button;
