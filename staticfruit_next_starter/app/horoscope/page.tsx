'use client'; import Header from '@/components/Header'; import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; import { Input } from '@/components/ui/input';
import useSWR from 'swr'; import { getHoroscope } from '@/lib/api'; import { useState } from 'react';
export default function Page(){
  const [sign, setSign] = useState('leo'); const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const { data, mutate } = useSWR(['hs',sign,date], () => getHoroscope(sign, date));
  return (<div className='max-w-md mx-auto px-4 pb-20'><Header/>
    <Card><CardHeader><CardTitle>Generate</CardTitle></CardHeader>
      <CardContent>
        <Input value={sign} onChange={e=>setSign(e.target.value)} placeholder='Sign (e.g., leo)'/>
        <Input value={date} onChange={e=>setDate(e.target.value)} type='date'/>
        <Button onClick={()=>mutate()}>Get Horoscope</Button>
      </CardContent>
    </Card>
    <div className='h-4'/>
    <Card><CardHeader><CardTitle>Today’s Drop</CardTitle></CardHeader>
      <CardContent>
        <div className='text-sm'>Theme: {data?.theme||'—'}</div>
        <div className='text-xl font-semibold'>{data?.bar||'—'}</div>
        <div className='flex gap-2 pt-2'><Button>Claim on Base</Button><Button className='border-white/20 bg-white/5'>Share</Button></div>
      </CardContent>
    </Card>
    <BottomNav/></div>);
}