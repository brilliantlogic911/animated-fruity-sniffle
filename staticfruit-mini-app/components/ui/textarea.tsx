import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return <textarea {...props} className={`px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm min-h-[120px] ${className}`} />;
}