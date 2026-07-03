'use client';

import { useState, useEffect, useRef } from 'react';

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
};

/**
 * Format phone number to Indonesian format: +62 812 3456 7890
 */
function formatPhoneNumber(digits: string): string {
  // Remove all non-digits
  const cleaned = digits.replace(/\D/g, '');
  
  // If starts with 0, replace with 62
  let normalized = cleaned;
  if (cleaned.startsWith('0')) {
    normalized = '62' + cleaned.slice(1);
  }
  
  // If doesn't start with 62, assume it's a local number and add 62
  if (!normalized.startsWith('62')) {
    normalized = '62' + normalized;
  }
  
  // Format: +62 812 3456 7890
  // After +62, we want: 3 digits, 4 digits, 4 digits
  const prefix = normalized.slice(0, 2); // 62
  const part1 = normalized.slice(2, 5);  // 812
  const part2 = normalized.slice(5, 9);  // 3456
  const part3 = normalized.slice(9, 13); // 7890
  
  let formatted = '+' + prefix;
  if (part1) formatted += ' ' + part1;
  if (part2) formatted += ' ' + part2;
  if (part3) formatted += ' ' + part3;
  
  return formatted.trim();
}

/**
 * Extract raw digits from formatted phone number
 */
function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function PhoneInput({
  value,
  onChange,
  placeholder = '+62 812 3456 7890',
  className = '',
  disabled = false,
  label = 'Telepon',
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes
  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Extract only digits
    const digits = extractDigits(rawValue);
    
    // Limit to 14 digits (Indonesian phone numbers are typically 10-13 digits)
    const limitedDigits = digits.slice(0, 14);
    
    // Format the number
    const formatted = formatPhoneNumber(limitedDigits);
    
    setDisplayValue(formatted);
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key)) {
      return;
    }
    
    // Block non-numeric input
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = extractDigits(pastedText).slice(0, 14);
    const formatted = formatPhoneNumber(digits);
    setDisplayValue(formatted);
    onChange(formatted);
  };

  return (
    <div>
      <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        inputMode="tel"
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange transition-colors ${className}`}
      />
      <p className="text-xs text-stone-400 mt-1">
        Format: +62 812 3456 7890 (nomor Indonesia)
      </p>
    </div>
  );
}
