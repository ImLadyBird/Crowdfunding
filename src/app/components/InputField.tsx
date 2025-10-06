
import React, { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  type: string;
  placeholder?: string;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ type, placeholder, ...rest }, ref) => (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      {...rest}
    />
  )
);

InputField.displayName = "InputField";
export default InputField;
