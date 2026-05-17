interface InputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  disabled,
  error,
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3 py-2.5 text-sm border rounded-lg bg-white
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900
          disabled:bg-gray-50 disabled:text-gray-400
          transition-colors
          ${error ? "border-red-300" : "border-gray-200"}
        `}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}