'use client'; import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

interface TabsContentProps {
  active?: boolean;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return <div data-tabs="" data-value={value} onChange={() => onValueChange(value)}>{children}</div>;
}

export function TabsList({ children }: TabsListProps) {
  return <div className='grid grid-cols-4 bg-white/5 p-1 rounded-2xl'>{children}</div>;
}

export function TabsTrigger({ active, onClick, children }: TabsTriggerProps) {
  return <button onClick={onClick} className={`rounded-xl px-3 py-2 text-sm ${active ? 'bg-white/10' : ''}`}>{children}</button>;
}

export function TabsContent({ active, children }: TabsContentProps) {
  if (!active) return null;
  return <div className='mt-6'>{children}</div>;
}
