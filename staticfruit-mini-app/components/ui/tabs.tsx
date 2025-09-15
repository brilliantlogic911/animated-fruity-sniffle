'use client'; import React from 'react';
export function Tabs({ value, onValueChange, children }: any){ return <div data-tabs value={value} onChange={onValueChange}>{children}</div>}
export function TabsList({ children }: any){ return <div className='grid grid-cols-4 bg-white/5 p-1 rounded-2xl'>{children}</div>}
export function TabsTrigger({ value, active, onClick, children }: any){ return <button onClick={onClick} className={'rounded-xl px-3 py-2 text-sm ' + (active?'bg-white/10':'')}>{children}</button>}
export function TabsContent({ active, children }: any){ if(!active) return null; return <div className='mt-6'>{children}</div>}
