import React from 'react'; import clsx from 'clsx';
export function Card({ className='', children }: any){ return <div className={clsx('rounded-2xl border border-white/10 bg-space text-mist shadow', className)}>{children}</div>}
export function CardHeader({ children }: any){ return <div className='px-4 pt-4'>{children}</div>}
export function CardTitle({ children }: any){ return <div className='text-sm font-semibold'>{children}</div>}
export function CardContent({ children }: any){ return <div className='px-4 pb-4 pt-2 space-y-3'>{children}</div>}
