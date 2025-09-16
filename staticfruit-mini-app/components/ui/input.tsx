import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  return <input {...props} className={`px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm ${className}`} />;
}