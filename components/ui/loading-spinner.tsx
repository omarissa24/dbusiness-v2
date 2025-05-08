import { ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 40,
  color = "hsl(var(--primary))",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ClipLoader
        size={size}
        color={color}
        loading={true}
        aria-label='Loading Spinner'
      />
    </div>
  );
}
