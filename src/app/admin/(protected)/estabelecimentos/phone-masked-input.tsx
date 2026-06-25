"use client";

import { useEffect, useState, useCallback } from "react";

function formatPhoneBR(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatLandlineBR(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (!digits) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
}

type PhoneMaskedInputProps = {
  name: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  isLandline?: boolean;
};

export function PhoneMaskedInput({ name, defaultValue, className, placeholder, isLandline }: PhoneMaskedInputProps) {
  const formatFn = useCallback((val: string) => (isLandline ? formatLandlineBR(val) : formatPhoneBR(val)), [isLandline]);
  const [value, setValue] = useState(formatFn(defaultValue ?? ""));

  useEffect(() => {
    setValue(formatFn(defaultValue ?? ""));
  }, [defaultValue, formatFn]);

  return (
    <input
      type="text"
      name={name}
      inputMode="numeric"
      autoComplete="tel"
      maxLength={isLandline ? 14 : 14}
      value={value}
      onChange={(event) => setValue(formatFn(event.target.value))}
      className={className}
      placeholder={placeholder}
    />
  );
}