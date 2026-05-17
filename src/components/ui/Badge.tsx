interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variantStyles: Record<string, string> = {
  default: "bg-gray-100 text-gray-600",
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-700",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}