import React from 'react'; import clsx from 'clsx';
export function Button({ className='', variant='solid', ...props }: any) {
  const base = 'px-4 py-2 rounded-xl text-sm transition';
  const styles = variant === 'outline' ? 'border border-white/20 bg-white/5' : 'bg-primary text-space hover:opacity-90';
  return <button className={clsx(base, styles, className)} {...props} />;
}