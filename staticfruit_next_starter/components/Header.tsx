import React from 'react'; import { Button } from './ui/button';
export default function Header(){
  return (<div className='flex items-center justify-between mb-4'>
    <div className='flex items-center gap-3'>
      <div className='h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-space font-black'>SF</div>
      <div><div className='text-lg font-bold'>StaticFruit</div><div className='text-xs text-white/60'>Horoscope • Bars • Markets</div></div>
    </div>
    <Button>Connect</Button>
  </div>);
}