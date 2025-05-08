import { Oval } from "react-loader-spinner";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 40,
  color = "hsl(var(--primary))",
  secondaryColor = "hsl(var(--primary))",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Oval
        height={size}
        width={size}
        color={color}
        secondaryColor={secondaryColor}
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
}
