"use client";

import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  id,
  className,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(checked);

  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      const newValue = !internalChecked;
      setInternalChecked(newValue);
      onCheckedChange(newValue);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={internalChecked}
      aria-disabled={disabled}
      disabled={disabled}
      id={id}
      onClick={handleClick}
      className={twMerge(
        clsx(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
          internalChecked
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-200 hover:bg-gray-300"
        ),
        className
      )}
    >
      <span
        className={twMerge(
          clsx(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            internalChecked ? "translate-x-5" : "translate-x-0"
          )
        )}
      />
    </button>
  );
}

