'use client'; import React from 'react'; import Link from 'next/link'; import { usePathname } from 'next/navigation';
export default function BottomNav(){
  const p = usePathname();
  const Item = ({href, label}:{href:string,label:string}) => <Link href={href} className={'flex-1 text-center py-2 text-xs ' + (p===href?'bg-white/10':'')}>{label}</Link>;
  return (<div className='fixed bottom-0 left-0 right-0 bg-space/90 border-t border-white/10 grid grid-cols-4'>{[
    ['/', 'Home'], ['/horoscope','Horoscope'], ['/bars','Bars'], ['/markets','Markets']
  ].map(([h,l]) => <Item key={h} href={h} label={l as string}/>)}</div>);
}