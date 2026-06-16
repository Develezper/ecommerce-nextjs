"use client";

import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordFieldProps = Omit<ComponentProps<typeof Input>, "type" | "children"> & {
  hideLabel: string;
  label: string;
  showLabel: string;
};

export function PasswordField({
  className,
  hideLabel,
  id,
  label,
  showLabel,
  ...props
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleLabel = isVisible ? hideLabel : showLabel;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        <Input
          {...props}
          id={id}
          type={isVisible ? "text" : "password"}
          className={cn("pr-11", className)}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsVisible((currentValue) => !currentValue)}
          aria-label={toggleLabel}
          title={toggleLabel}
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </div>
  );
}
