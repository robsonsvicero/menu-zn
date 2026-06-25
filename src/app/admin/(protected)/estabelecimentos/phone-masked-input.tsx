"use client";

import { useEffect, useState } from "react";

function formatDynamicPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 10) {
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
}

type PhoneMaskedInputProps = {
  name: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
};

export function PhoneMaskedInput({ name, defaultValue, className, placeholder }: PhoneMaskedInputProps) {
  const [value, setValue] = useState(formatDynamicPhone(defaultValue ?? ""));

  useEffect(() => {
    setValue(formatDynamicPhone(defaultValue ?? ""));
  }, [defaultValue]);

  return (
    <input
      type="text"
      name={name}
      inputMode="numeric"
      autoComplete="tel"
      maxLength={15}
      value={value}
      onChange={(event) => setValue(formatDynamicPhone(event.target.value))}
      className={className}
      placeholder={placeholder}
    />
  );
}