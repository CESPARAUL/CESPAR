"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { InputIcon, inputClasses, inputWithIconClasses } from "@/components/ui/FormField";
import { cn } from "@/lib/utils";

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder = "••••••••",
  minLength,
  withIcon = true,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  placeholder?: string;
  minLength?: number;
  withIcon?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  const input = (
    <input
      id={id}
      type={visible ? "text" : "password"}
      required
      minLength={minLength}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      className={cn(withIcon ? inputWithIconClasses : inputClasses, "pr-10")}
      placeholder={placeholder}
    />
  );

  const toggle = (
    <button
      type="button"
      onClick={() => setVisible((v) => !v)}
      tabIndex={-1}
      aria-label={visible ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-space-950/40 transition-colors hover:text-space-950/70"
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  if (!withIcon) {
    return (
      <div className="relative">
        {input}
        {toggle}
      </div>
    );
  }

  return (
    <InputIcon icon={Lock}>
      {input}
      {toggle}
    </InputIcon>
  );
}
