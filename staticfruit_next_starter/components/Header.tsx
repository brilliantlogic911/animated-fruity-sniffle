import React from 'react';
import Image from 'next/image';
import BaseAuthButton from './BaseAuthButton';

export default function Header(){
  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4'>
      <div className='flex items-center gap-3'>
        <Image src='/static-fruit-logo.png' alt='StaticFruit Logo' width={40} height={40} className='rounded-2xl' />
        <div>
          <div className='text-lg font-bold font-orbitron text-white'>StaticFruit</div>
          <div className='text-xs text-silver font-inter'>Horoscope • Bars • Markets</div>
        </div>
      </div>
      <BaseAuthButton compact className='self-start sm:self-auto' />
    </div>
  );
}